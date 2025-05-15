const express = require('express');
const router = express.Router();
const vaultService = require('../services/vaultService');

// Get vault statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await vaultService.getVaultStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching vault stats:', error);
    res.status(500).json({ error: 'Failed to fetch vault statistics' });
  }
});

// Deposit USDC
router.post('/deposit', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const result = await vaultService.depositUsdc(Number(amount));
    res.json(result);
  } catch (error) {
    console.error('Error depositing USDC:', error);
    res.status(500).json({ error: 'Failed to deposit USDC' });
  }
});

module.exports = router;
