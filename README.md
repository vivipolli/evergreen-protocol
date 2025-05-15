# Evergreen Protocol

## Overview
Evergreen Protocol is a decentralized platform that tokenizes real-world land assets (RWAs) to promote environmental preservation while providing financial opportunities. The protocol enables landowners to tokenize their properties as NFTs (EVG-L) and investors to participate through a vault system (EVG-S).

## Architecture

### Smart Contracts (Anchor)
- **Land Token (EVG-L)**: NFT representing real land assets
  - Stores land metadata (vegetation, water bodies, CAR registry)
  - Immutable ownership records
  - Transferable tokens

- **Vault System**
  - Manages USDC deposits and EVG-S token distribution
  - Handles land token purchases
  - Distributes earnings to EVG-S holders
  - Fee structure:
    - Minting: 2%
    - Sales: 2.5%
    - Distribution: 0.5%

### Backend (Node.js)
- **API Endpoints**
  - Land token creation and management
  - Vault operations (deposits, purchases, distributions)
  - IPFS integration for metadata storage

- **Services**
  - NFT Service: Handles land token creation and transfers
  - Vault Service: Manages vault operations and token distributions
  - IPFS Service: Stores land images and metadata

### Frontend (Next.js)
- User authentication and wallet connection
- Land token creation interface
- Vault participation dashboard
- Portfolio management
- Transaction history

## Tokenomics

### EVG-L (Land Token)
- Represents ownership of real land assets
- Contains environmental and legal metadata
- Transferable between users
- Used for land preservation tracking

### EVG-S (Vault Token)
- Represents share in the vault
- Earns from land token sales and distributions
- Used for governance (future implementation)
- Backed by USDC deposits

## Governance (Future Implementation)

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
