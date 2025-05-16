const express = require('express');
const router = express.Router();
const nftService = require('../services/nftService');

// Create land token
router.post('/create', express.json(), async (req, res) => {
  try {
    const { landData } = req.body;
    const { symbol = 'EVGL' } = landData; // Default symbol if not provided
    const result = await nftService.createLandToken({ ...landData, symbol });
    res.json(result);
  } catch (error) {
    console.error('Error creating land token:', error);
    res.status(500).json({ error: error.message });
  }
});

// List user NFTs
router.get('/list', async (req, res) => {
  try {
    const { wallet } = req.query;
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    const nfts = await nftService.listUserNFTs(wallet);
    res.json(nfts);
  } catch (error) {
    console.error('Error listing user NFTs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify token ownership
router.get('/verify', async (req, res) => {
  try {
    const { mint, owner } = req.query;
    if (!mint || !owner) {
      return res.status(400).json({ error: 'Mint address and owner address are required' });
    }
    const result = await nftService.verifyTokenOwnership(mint, owner);
    res.json(result);
  } catch (error) {
    console.error('Error verifying token ownership:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 