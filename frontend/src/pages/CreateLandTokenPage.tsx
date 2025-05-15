import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import LandTokenForm from '../components/LandTokenForm';
import { nftService } from '../services/nftService';

interface LandTokenData {
  carNumber: string;
  carStatus: string;
  propertyName: string;
  geoJson: File | null;
  commitmentHash: string;
  environmentalMetadata: {
    vegetationCover: string;
    hasApp: boolean;
    appDetails?: string;
  };
  termsAccepted: boolean;
}

export default function CreateLandTokenPage() {
  const { publicKey, connected } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (data: LandTokenData) => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const result = await nftService.createLandToken(data, publicKey.toString());
      
      if (result.success) {
        setSuccess(`Land token created successfully! Mint address: ${result.mintAddress}`);
      } else {
        throw new Error('Failed to create land token');
      }
    } catch (error) {
      setError('Failed to create land token. Please try again.');
      console.error('Error creating land token:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-evergreen-700">Connect Your Wallet</h2>
          <p className="mt-4 text-lg text-evergreen-600">
            Please connect your wallet to create a land token
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-eco p-6">
        <h1 className="text-2xl font-bold text-evergreen-700 mb-6">
          Create Land Token (EVG-L)
        </h1>
        
        <div className="mb-6 p-4 bg-evergreen-50 rounded-lg">
          <h2 className="text-lg font-semibold text-evergreen-700 mb-2">
            Requirements for EVG-L Token Minting
          </h2>
          <ul className="list-disc list-inside text-evergreen-600 space-y-2">
            <li>Valid CAR number with regular status in SICAR</li>
            <li>Property area polygon in GeoJSON format</li>
            <li>Forest use commitment declaration</li>
            <li>Document and commitment contract hash</li>
            <li>Environmental metadata</li>
            <li>Legal responsibility acceptance</li>
          </ul>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        <LandTokenForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 