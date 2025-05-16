require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Connection, clusterApiUrl, Keypair } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const fs = require('fs');
const path = require('path');
const landRoutes = require('./routes/landRoutes');
const vaultRoutes = require('./routes/vaultRoutes');
const nftRoutes = require('./routes/nftRoutes');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://evergreen-protocol.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Solana connection setup
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const wallet = Keypair.fromSecretKey(
  Buffer.from(JSON.parse(process.env.WALLET_SECRET_KEY))
);

// Metaplex setup
const metaplex = new Metaplex(connection);
metaplex.use(keypairIdentity(wallet));

// Routes
app.use('/api/land', landRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/nft', nftRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Evergreen Registry API' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 