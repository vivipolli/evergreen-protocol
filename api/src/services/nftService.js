const { Connection, clusterApiUrl, Keypair, PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const ipfsService = require('./ipfsService');
const axios = require('axios');

console.log('Environment variables:', {
  hasWalletKey: !!process.env.WALLET_SECRET_KEY,
  rpcUrl: process.env.SOLANA_RPC_URL,
  pinataApiKey: !!process.env.PINATA_API_KEY,
  pinataSecretApiKey: !!process.env.PINATA_SECRET_API_KEY
});

class NftService {
  constructor() {
    if (!process.env.WALLET_SECRET_KEY) {
      throw new Error('WALLET_SECRET_KEY environment variable is not set');
    }

    try {
      const secretKey = JSON.parse(process.env.WALLET_SECRET_KEY);
      const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
      
      const connection = new Connection(clusterApiUrl('devnet'));
      this.metaplex = Metaplex.make(connection)
        .use(keypairIdentity(keypair))
    } catch (error) {
      throw new Error('Failed to initialize NFT service: ' + error.message);
    }
  }

  async createLandToken(landData) {
    try {
      if (!landData.ownerAddress) {
        throw new Error('Owner address is required');
      }

      // Create metadata
      const metadata = {
        name: landData.propertyName,
        symbol: landData.symbol || 'EVGL',
        description: 'Land token representing forest preservation commitment',
        image: landData.image || 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        attributes: [
          {
            trait_type: 'CAR Number',
            value: landData.carNumber,
          },
          {
            trait_type: 'CAR Status',
            value: landData.carStatus,
          },
          {
            trait_type: 'Vegetation Coverage',
            value: landData.environmentalMetadata.vegetationCover,
          },
          {
            trait_type: 'Has APP',
            value: landData.environmentalMetadata.hasApp,
          },
          {
            trait_type: 'APP Details',
            value: landData.environmentalMetadata.appDetails || 'N/A',
          },
          {
            trait_type: 'Commitment Hash',
            value: landData.commitmentHash,
          },
        ],
        properties: {
          files: [
            {
              uri: landData.image || 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
              type: 'image/png',
            },
            {
              uri: landData.geoJson,
              type: 'application/geo+json',
            },
          ],
          category: 'land',
        },
      };

      // Upload metadata to IPFS using Pinata
      const metadataUpload = await ipfsService.uploadMetadata(metadata);
      const metadataUri = `ipfs://${metadataUpload.IpfsHash}`;

      console.log('Creating NFT with metadata:', metadataUri);

      // Create NFT
      const { nft } = await this.metaplex.nfts().create({
        uri: metadataUri,
        name: landData.propertyName,
        symbol: landData.symbol || 'EVGL',
        sellerFeeBasisPoints: 0,
        updateAuthority: this.metaplex.identity(),
        mintAuthority: this.metaplex.identity(),
        tokenStandard: 0,
        isCollection: false,
      });

      console.log('NFT created:', nft.mint.address.toBase58());

      // Transfer NFT to the owner
      console.log('Transferring NFT to owner:', landData.ownerAddress);
      const { response } = await this.metaplex.nfts().transfer({
        nftOrSft: nft,
        toOwner: new PublicKey(landData.ownerAddress),
        fromOwner: this.metaplex.identity().publicKey
      });

      console.log('Transfer completed:', response.signature);

      return {
        success: true,
        mintAddress: nft.mint.address.toBase58(),
        metadataUri,
        owner: landData.ownerAddress,
        signature: response.signature
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
      console.log('Listing NFTs for address:', userAddress);
      
      const nfts = await this.metaplex.nfts().findAllByOwner({
        owner: new PublicKey(userAddress)
      });

      console.log('Found NFTs:', nfts.length);
      console.log('NFT structure:', JSON.stringify(nfts[0], null, 2));

      const formattedTokens = await Promise.all(nfts.map(async nft => {
        const metadata = await this.getPinataMetadata(nft.uri);
        
        return {
          name: nft.name,
          symbol: nft.symbol,
          mintAddress: nft.mintAddress.toBase58(),
          updateAuthority: nft.updateAuthorityAddress.toBase58(),
          uri: nft.uri,
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