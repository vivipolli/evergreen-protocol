import { useState } from 'react';
import LandTokenForm from '../components/LandTokenForm';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: LandTokenData) => {
    try {
      setIsSubmitting(true);
      // TODO: Implement actual minting logic
      console.log('Land token data:', data);
    } catch (error) {
      console.error('Error creating land token:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <LandTokenForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 