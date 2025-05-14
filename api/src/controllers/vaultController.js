const vaultService = require('../services/vaultService');

class VaultController {
  async initializeVault(req, res) {
    try {
      const { usdcMint } = req.body;
      const result = await vaultService.initializeVault(usdcMint);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async depositUsdc(req, res) {
    try {
      const { amount } = req.body;
      const result = await vaultService.depositUsdc(amount);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async purchaseEvgL(req, res) {
    try {
      const { price, sellerAddress } = req.body;
      const result = await vaultService.purchaseEvgL(price, sellerAddress);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async distributeEarnings(req, res) {
    try {
      const { amount } = req.body;
      const result = await vaultService.distributeEarnings(amount);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new VaultController();
