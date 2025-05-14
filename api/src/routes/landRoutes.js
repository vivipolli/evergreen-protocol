const express = require('express');
const router = express.Router();
const landController = require('../controllers/landController');
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

router.get('/verify/:mintAddress', async (req, res) => {
    try {
      const { mintAddress } = req.params;
      const { expectedOwner } = req.query;
      
      const verification = await nftService.verifyTokenOwnership(mintAddress, expectedOwner);
      res.json(verification);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
router.post('/transfer', async (req, res) => {
    try {
      const { mintAddress, fromOwner, toOwner } = req.body;
      
      const transfer = await nftService.transferToken(mintAddress, fromOwner, toOwner);
      res.json(transfer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Create land token route
router.post('/create', upload.single('image'), landController.createLandToken);

router.get('/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const nfts = await nftService.listUserNFTs(address);
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router; 