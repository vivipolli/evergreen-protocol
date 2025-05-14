const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const { Connection, clusterApiUrl, Keypair } = require('@solana/web3.js');
const ipfsService = require('./ipfsService');
const axios = require('axios');

class NftService {
  constructor() {
    this.connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    this.wallet = Keypair.fromSecretKey(
      Buffer.from(JSON.parse(process.env.WALLET_SECRET_KEY))
    );
    this.metaplex = new Metaplex(this.connection);
    this.metaplex.use(keypairIdentity(this.wallet));
  }

  async createLandToken(landData) {
    try {
      // Upload land image to IPFS
      const imageUpload = await ipfsService.uploadFile(
        landData.imagePath,
        'land-image.png'
      );
      const imageUri = `ipfs://${imageUpload.IpfsHash}`;

      // Create metadata
      const metadata = {
        name: landData.name,
        symbol: 'EVG-L',
        description: landData.description,
        image: imageUri,
        attributes: [
          {
            trait_type: 'Vegetation Coverage',
            value: landData.vegetationCoverage,
          },
          {
            trait_type: 'Hectares',
            value: landData.hectares,
          },
          {
            trait_type: 'Water Bodies',
            value: landData.waterBodies,
          },
          {
            trait_type: 'Springs',
            value: landData.springs,
          },
          {
            trait_type: 'CAR Registry',
            value: landData.carRegistry,
          },
        ],
        properties: {
          files: [
            {
              uri: imageUri,
              type: 'image/png',
            },
          ],
          category: 'image',
        },
      };

      // Upload metadata to IPFS
      const metadataUpload = await ipfsService.uploadMetadata(metadata);
      const metadataUri = `ipfs://${metadataUpload.IpfsHash}`;

      // Convert owner address string to PublicKey
      const ownerPublicKey = new PublicKey(landData.ownerAddress);

      // Create NFT using Metaplex
      const { nft } = await this.metaplex.nfts().create({
        uri: metadataUri,
        name: landData.name,
        symbol: 'EVG-L',
        sellerFeeBasisPoints: 0,
        isCollection: false,
        updateAuthority: ownerPublicKey,
        mintAuthority: ownerPublicKey,
        tokenStandard: 0,
        tokenOwner: ownerPublicKey,
      });

      return {
        success: true,
        mintAddress: nft.address.toString(),
        metadataUri,
        owner: ownerPublicKey.toString(),
      };
    } catch (error) {
      console.error('Error creating land token:', error);
      throw error;
    }
  }

  async verifyTokenOwnership(mintAddress, expectedOwner) {
    try {
      const nft = await this.metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
      
      const currentOwner = nft.owner.toString();
      const isOwnerValid = currentOwner === expectedOwner;
      
      const isTokenValid = nft.mintAddress && !nft.burned;
      
      return {
        isValid: isOwnerValid && isTokenValid,
        currentOwner,
        expectedOwner,
        tokenDetails: {
          name: nft.name,
          symbol: nft.symbol,
          mintAddress: nft.mintAddress.toString(),
          updateAuthority: nft.updateAuthority.toString()
        }
      };
    } catch (error) {
      console.error('Error verifying token ownership:', error);
      throw error;
    }
  }

  async transferToken(mintAddress, fromOwner, toOwner) {
    try {
      const nft = await this.metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
      
      if (nft.owner.toString() !== fromOwner) {
        throw new Error('Current owner does not match the sender address');
      }
      
      const { response } = await this.metaplex.nfts().transfer({
        nftOrSft: nft,
        toOwner: new PublicKey(toOwner),
        fromOwner: new PublicKey(fromOwner)
      });
      
      return {
        success: true,
        signature: response.signature,
        newOwner: toOwner,
        mintAddress: mintAddress
      };
    } catch (error) {
      console.error('Error transferring token:', error);
      throw error;
    }
  }

  async getPinataMetadata(uri) {
    try {
      const cleanedHash = uri.replace(/^ipfs:\/\//, "").replace(/^ipfs:/, "");
      const metadataIPFS = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await axios.get(metadataIPFS);
      return response.data;
    } catch (error) {
      console.error("Error getting metadata from Pinata:", error);
      return null;
    }
  }

  async listUserNFTs(userAddress) {
    try {
      const nfts = await this.metaplex.nfts().findAllByOwner({
        owner: new PublicKey(userAddress)
      });

      const landTokens = nfts.filter(nft => nft.symbol === 'EVG-L');

      const formattedTokens = await Promise.all(landTokens.map(async nft => {
        const metadata = await this.getPinataMetadata(nft.uri);
        
        return {
          name: nft.name,
          symbol: nft.symbol,
          mintAddress: nft.mintAddress.toString(),
          owner: nft.owner.toString(),
          updateAuthority: nft.updateAuthority.toString(),
          landData: metadata ? {
            description: metadata.description,
            image: metadata.image,
            attributes: metadata.attributes,
            vegetationCoverage: metadata.attributes.find(
              attr => attr.trait_type === 'Vegetation Coverage'
            )?.value,
            hectares: metadata.attributes.find(
              attr => attr.trait_type === 'Hectares'
            )?.value,
            waterBodies: metadata.attributes.find(
              attr => attr.trait_type === 'Water Bodies'
            )?.value,
            springs: metadata.attributes.find(
              attr => attr.trait_type === 'Springs'
            )?.value,
            carRegistry: metadata.attributes.find(
              attr => attr.trait_type === 'CAR Registry'
            )?.value,
          } : null
        };
      }));

      return {
        success: true,
        total: formattedTokens.length,
        tokens: formattedTokens
      };
    } catch (error) {
      console.error('Error listing user NFTs:', error);
      throw error;
    }
  }
}

module.exports = new NftService(); 