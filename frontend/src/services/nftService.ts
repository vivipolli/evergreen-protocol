interface LandTokenData {
  carNumber: string;
  carStatus: string;
  propertyName: string;
  geoJson: File | null;
  image: File | null;
  commitmentHash: string;
  environmentalMetadata: {
    vegetationCover: string;
    hasApp: boolean;
    appDetails?: string;
  };
  termsAccepted: boolean;
}

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
    waterBodies?: string;
    springs?: string;
    carRegistry?: string;
    carNumber?: string;
    carStatus?: string;
    hasApp?: boolean;
    appDetails?: string;
    commitmentHash?: string;
  } | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class NftService {
  async createLandToken(data: LandTokenData, ownerAddress: string): Promise<{ success: boolean; mintAddress: string }> {
    try {
      let geoJsonContent = null;
      if (data.geoJson) {
        geoJsonContent = await data.geoJson.text();
      }

      let imageContent = null;
      if (data.image) {
        imageContent = await data.image.text();
      }

      const response = await fetch(`${API_BASE_URL}/api/nft/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          landData: {
            ownerAddress,
            carNumber: data.carNumber,
            carStatus: data.carStatus,
            propertyName: data.propertyName,
            geoJson: geoJsonContent,
            image: imageContent,
            commitmentHash: data.commitmentHash,
            environmentalMetadata: data.environmentalMetadata,
            symbol: 'EVGL',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create land token');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating land token:', error);
      throw error;
    }
  }

  async listUserNFTs(userAddress: string): Promise<{ success: boolean; total: number; tokens: LandToken[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/nft/list?wallet=${userAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user NFTs');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      throw error;
    }
  }

  async verifyTokenOwnership(mintAddress: string, expectedOwner: string): Promise<{
    isValid: boolean;
    currentOwner: string;
    expectedOwner: string;
    tokenDetails: {
      name: string;
      symbol: string;
      mintAddress: string;
      updateAuthority: string;
    };
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/nft/verify?mint=${mintAddress}&owner=${expectedOwner}`);
      if (!response.ok) {
        throw new Error('Failed to verify token ownership');
      }
      return await response.json();
    } catch (error) {
      console.error('Error verifying token ownership:', error);
      throw error;
    }
  }
}

export const nftService = new NftService(); 