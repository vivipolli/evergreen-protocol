const express = require('express');
const router = express.Router();
const vaultService = require('../services/vaultService');

// Get vault statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('GET /vault/stats - Request received');
    const { wallet } = req.query;
    
    if (!wallet) {
      console.error('GET /vault/stats - Missing wallet address');
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    console.log('GET /vault/stats - Fetching stats for wallet:', wallet);
    const stats = await vaultService.getVaultStats();
    console.log('GET /vault/stats - Stats retrieved successfully:', stats);
    res.json(stats);
  } catch (error) {
    console.error('GET /vault/stats - Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch vault statistics' });
  }
});

// Deposit USDC
router.post('/deposit', async (req, res) => {
  try {
    console.log('POST /vault/deposit - Request received');
    const { wallet, amount } = req.body;
    
    if (!wallet) {
      console.error('POST /vault/deposit - Missing wallet address');
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    if (!amount) {
      console.error('POST /vault/deposit - Missing amount');
      return res.status(400).json({ error: 'Amount is required' });
    }

    console.log('POST /vault/deposit - Processing deposit for wallet:', wallet, 'amount:', amount);
    const result = await vaultService.depositUsdc(wallet, amount);
    console.log('POST /vault/deposit - Deposit successful:', result);
    res.json(result);
  } catch (error) {
    console.error('POST /vault/deposit - Error:', error);
    res.status(500).json({ error: error.message || 'Failed to deposit USDC' });
  }
});

// Get EVG-S balance
router.get('/evg-s-balance', async (req, res) => {
  try {
    console.log('GET /vault/evg-s-balance - Request received');
    const { wallet } = req.query;
    
    if (!wallet) {
      console.error('GET /vault/evg-s-balance - Missing wallet address');
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    console.log('GET /vault/evg-s-balance - Fetching balance for wallet:', wallet);
    const balance = await vaultService.getEvgSBalance(wallet);
    console.log('GET /vault/evg-s-balance - Balance retrieved successfully:', balance);
    res.json({ balance });
  } catch (error) {
    console.error('GET /vault/evg-s-balance - Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch EVG-S balance' });
  }
});

// Get land tokens
router.get('/land-tokens', async (req, res) => {
  try {
    console.log('GET /vault/land-tokens - Request received');
    const { wallet } = req.query;
    
    if (!wallet) {
      console.error('GET /vault/land-tokens - Missing wallet address');
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    console.log('GET /vault/land-tokens - Fetching tokens for wallet:', wallet);
    const tokens = await vaultService.getLandTokens(wallet);
    console.log('GET /vault/land-tokens - Tokens retrieved successfully:', tokens);
    res.json(tokens);
  } catch (error) {
    console.error('GET /vault/land-tokens - Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch land tokens' });
  }
});

// Initialize vault (for testing)
router.post('/initialize', async (req, res) => {
  try {
    console.log('POST /vault/initialize - Request received');
    const tx = await vaultService.initializeVault();
    console.log('POST /vault/initialize - Vault initialized successfully:', tx);
    res.json({ success: true, transactionId: tx });
  } catch (error) {
    console.error('POST /vault/initialize - Error:', error);
    res.status(500).json({ error: error.message || 'Failed to initialize vault' });
  }
});

module.exports = router;
