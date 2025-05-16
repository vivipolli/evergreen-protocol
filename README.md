# Evergreen Protocol

## Overview
Evergreen Protocol is a decentralized platform that tokenizes real-world land assets (RWAs) to promote environmental preservation while providing financial opportunities. The protocol enables landowners to tokenize their properties as NFTs (EVG-L) and investors to participate through a vault system (EVG-S).

## Current Implementation (Hackathon)

### Smart Contracts (Anchor)
- **Land Token (EVG-L)**: NFT representing real land assets
  - Stores land metadata (vegetation, water bodies, CAR registry)
  - Immutable ownership records
  - Transferable tokens

- **Vault System**
  - USDC deposits and EVG-S token distribution (1:1 ratio)
  - Basic land token purchases
  - Simple fee structure:
    - Minting: 2%
    - Sales: 2.5%

### Backend (Node.js)
- **API Endpoints**
  - Land token creation and management
  - Basic vault operations (deposits, purchases)
  - IPFS integration for metadata storage

- **Services**
  - NFT Service: Land token creation and transfers
  - Vault Service: Basic vault operations
  - IPFS Service: Metadata storage via Pinata

### Frontend (Next.js)
- Wallet connection (Phantom)
- Land token creation interface
- Vault participation dashboard
- Portfolio management
- Basic transaction history

## Tokenomics

### EVG-L (Land Token)
- Represents ownership of real land assets
- Contains environmental and legal metadata
- Transferable between users
- Used for land preservation tracking

### EVG-S (Vault Token)
- Represents share in the vault
- 1:1 ratio with USDC deposits
- Basic governance rights
- Backed by USDC deposits

## Future Implementation Plans

### Smart Contracts
- **Enhanced Land Token**
  - CAR registry integration
  - Environmental impact tracking
  - Legal compliance metadata
  - Automated verification system

- **Advanced Vault System**
  - Dynamic EVG-S pricing based on vault value
  - Automated earnings distribution
  - Advanced fee structure
  - Treasury management
  - Distribution fee: 0.5%

### Backend
- **Enhanced API**
  - Real-time price feeds
  - Advanced analytics
  - Automated compliance checks
  - Integration with environmental databases

- **Services**
  - Advanced NFT Service with verification
  - Sophisticated Vault Service with distributions
  - Enhanced IPFS Service with redundancy
  - Environmental impact tracking service

### Frontend
- Advanced analytics dashboard
- Environmental impact visualization
- Governance interface
- Advanced portfolio management
- Real-time market data

## Governance (Future)

### Vault DAO
- Land acquisition decisions
- Environmental impact strategies
- Treasury management
- Fee adjustments

### Governance Mechanisms
- Change proposals
- EVG-S weighted voting
- Voting periods
- Minimum quorum
- Automated proposal execution

### Protocol Treasury
- Fee management
- Resource distribution
- Development investments
- Community incentives

## Technical Stack
- **Smart Contracts**: Rust, Anchor Framework
- **Backend**: Node.js, Express
- **Frontend**: Next.js, TailwindCSS
- **Storage**: IPFS (Pinata)
- **Blockchain**: Solana
- **Tokens**: SPL Tokens, Metaplex

## Getting Started

### Prerequisites
- Node.js 16+
- Rust 1.70+
- Solana CLI
- Anchor Framework

### Development Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   yarn install

   # Frontend
   cd frontend
   yarn install
   ```
3. Configure environment variables:
   ```bash
   # Backend (.env)
   VAULT_KEYPAIR_PATH=./vault-keypair.json
   VAULT_PUBKEY=<public_key_from_vault_keypair>
   USDC_MINT_ADDRESS=<devnet_usdc_mint_address>
   ```

4. Setup Vault Wallet:
   ```bash
   # Create a new keypair for the vault
   solana-keygen new -o vault-keypair.json
   
   # Get the public key
   solana-keygen pubkey vault-keypair.json
   
   # Fund the vault wallet with SOL (devnet)
   solana airdrop 2 <vault_public_key> --url devnet
   ```

5. Initialize the Vault:
   ```bash
   # Deploy the program
   anchor deploy

   # Initialize vault (using the frontend or API)
   # The vault wallet will be used as the authority
   ```

6. Start development servers:
   ```bash
   # Backend
   yarn dev

   # Frontend
   yarn dev
   ```

### Testing
- Smart Contracts: `anchor test`
- Backend: `yarn test`
- Frontend: `yarn test`
