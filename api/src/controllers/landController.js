const nftService = require('../services/nftService');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

class LandController {
  async createLandToken(req, res) {
    try {
      const {
        name,
        description,
        vegetationCoverage,
        hectares,
        waterBodies,
        springs,
        carRegistry,
      } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }

      const landData = {
        name,
        description,
        vegetationCoverage,
        hectares,
        waterBodies,
        springs,
        carRegistry,
        imagePath: req.file.path,
      };

      const result = await nftService.createLandToken(landData);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in createLandToken:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new LandController(); 