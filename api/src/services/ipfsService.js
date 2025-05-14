const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class IpfsService {
  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY;
    this.pinataSecretKey = process.env.PINATA_SECRET_API_KEY;
  }

  async uploadFile(filePath, fileName) {
    try {
      const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
      const data = new FormData();
      data.append('file', fs.createReadStream(filePath), fileName);

      const response = await axios.post(url, data, {
        headers: {
          ...data.getHeaders(),
          pinata_api_key: this.pinataApiKey,
          pinata_secret_api_key: this.pinataSecretKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }

  async uploadMetadata(metadata) {
    try {
      const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
      const response = await axios.post(url, metadata, {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: this.pinataApiKey,
          pinata_secret_api_key: this.pinataSecretKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw error;
    }
  }
}

module.exports = new IpfsService(); 