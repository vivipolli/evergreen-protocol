const express = require('express');
const router = express.Router();
const vaultController = require('../controllers/vaultController');

// Inicializa o vault
router.post('/initialize', vaultController.initializeVault);

// Deposita USDC e recebe EVG-S
router.post('/deposit', vaultController.depositUsdc);

// Compra EVG-L token
router.post('/purchase', vaultController.purchaseEvgL);

// Distribui rendimentos
router.post('/distribute', vaultController.distributeEarnings);

module.exports = router;
