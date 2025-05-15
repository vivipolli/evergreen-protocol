import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { nftService } from '../services/nftService';

const convertIpfsToGateway = (ipfsUrl: string) => {
  if (!ipfsUrl) return '';
  return ipfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
};

interface LandToken {
  name: string;
  symbol: string;
  mintAddress: string;
  updateAuthority: string;
  uri: string;
  landData: {
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | boolean;
    }>;
    vegetationCoverage: string;
    waterBodies: string;
    springs: string;
    carRegistry: string;
  } | null;
}

export default function MyNFTsPage() {
  const { publicKey, connected } = useWallet();
  const [nfts, setNfts] = useState<LandToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs();
    }
  }, [connected, publicKey]);

  const fetchNFTs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await nftService.listUserNFTs(publicKey!.toString());
      setNfts(response.tokens);
    } catch (err) {
      setError('Failed to fetch NFTs');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-evergreen-700">Connect Your Wallet</h2>
          <p className="mt-4 text-lg text-evergreen-600">
            Please connect your wallet to view your NFTs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-evergreen-700 mb-8">My Land Tokens</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-evergreen-600">Loading your NFTs...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-evergreen-600">You don't have any land tokens yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <div key={nft.mintAddress} className="bg-evergreen-50 rounded-lg overflow-hidden">
                {nft.landData?.image && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={convertIpfsToGateway(nft.landData.image)}
                      alt={nft.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/600x400?text=No+Image';
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-evergreen-700 mb-2">{nft.name}</h3>
                  {nft.landData && (
                    <div className="space-y-2">
                      <p className="text-sm text-evergreen-600">
                        <span className="font-medium">CAR Registry:</span> {nft.landData.carRegistry}
                      </p>
                      <p className="text-sm text-evergreen-600">
                        <span className="font-medium">Vegetation Coverage:</span> {nft.landData.vegetationCoverage}%
                      </p>
                      <p className="text-sm text-evergreen-600">
                        <span className="font-medium">Water Bodies:</span> {nft.landData.waterBodies}
                      </p>
                      <p className="text-sm text-evergreen-600">
                        <span className="font-medium">Springs:</span> {nft.landData.springs}
                      </p>
                      {nft.landData.attributes.find(attr => attr.trait_type === 'Ongoing Projects')?.value && (
                        <p className="text-sm text-evergreen-600">
                          <span className="font-medium">Ongoing Projects:</span> {nft.landData.attributes.find(attr => attr.trait_type === 'Ongoing Projects')?.value}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-evergreen-200">
                    <p className="text-xs text-evergreen-500 truncate">
                      Token: {nft.mintAddress}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 