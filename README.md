# 🌲 Evergreen Protocol

<div align="center">

![Evergreen Protocol](https://img.shields.io/badge/Evergreen-Protocol-2ecc71)
![Solana](https://img.shields.io/badge/Solana-14F195?style=flat&logo=solana&logoColor=white)
![Anchor](https://img.shields.io/badge/Anchor-0.28.0-14F195)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=flat&logo=typescript&logoColor=white)

</div>

## 📋 Overview

Evergreen Protocol is a decentralized platform that tokenizes real-world land assets (RWAs) to promote environmental preservation while providing financial opportunities. The protocol enables landowners to tokenize their properties as NFTs (EVG-L) and investors to participate through a vault system (EVG-S).

## 🏗️ Architecture

### System Overview
- Frontend (Next.js) → API (Node.js) → Backend (Anchor) → Solana Blockchain
- API → IPFS Storage (for metadata)
- API → External APIs (for data integration)

### Core Components

#### 1. Backend (Anchor Smart Contracts)
- **Land Token (EVG-L)**
  - NFT representing real land assets
  - Stores land metadata (vegetation, water bodies, CAR registry)
  - Immutable ownership records
  - Transferable tokens

- **Vault System**
  - USDC deposits and EVG-S token distribution (1:1 ratio)
  - Basic land token purchases
  - Fee structure:
    - Minting: 2%
    - Sales: 2.5%

#### 2. API (Node.js Server)
- **Endpoints**
  - Land token creation and management
  - Basic vault operations (deposits, purchases)
  - IPFS integration for metadata storage

- **Services**
  - NFT Service: Land token creation and transfers
  - Vault Service: Basic vault operations
  - IPFS Service: Metadata storage via Pinata

#### 3. Frontend (Next.js)
- Wallet connection
- Land token creation interface
- Vault participation dashboard
- Portfolio management
- Basic transaction history

## 💰 Tokenomics

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

## 📚 Technical Documentation

### Backend Architecture 
- **Land Token Program** (Node Server)
  - Minting and burning of EVG-L tokens
  - Metadata storage and updates
  - Ownership and transfer management
  - CAR registry integration
- **Vault Program** (Smart Contracts)
  - USDC deposit and withdrawal
  - EVG-S token minting and burning

### Geolocation Example
```json
{
  "type": "Feature",
  "properties": {
    "name": "Sample Land Property",
    "area": "1000",
    "unit": "hectares",
    "vegetation": "Amazon Rainforest",
    "water_bodies": ["River X", "Lake Y"],
    "car_registry": "SP-123456789"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [-54.123456, -2.123456],
        [-54.123456, -2.234567],
        [-54.234567, -2.234567],
        [-54.234567, -2.123456],
        [-54.123456, -2.123456]
      ]
    ]
  }
}
```

### API Endpoints

#### Land Token Endpoints
- `POST /api/land/create` - Create new land token
- `GET /api/land/:id` - Get land token details
- `POST /api/land/transfer` - Transfer land token

#### Vault Endpoints
- `POST /api/vault/deposit` - Deposit USDC
- `POST /api/vault/withdraw` - Withdraw USDC
- `GET /api/vault/balance` - Get vault balance

### Frontend Architecture
- **Pages Layer**
  - Main application views
  - Route management
- **Components Layer**
  - Reusable UI components
  - Form handling
- **Services Layer**
  - API integration
  - Wallet connection
  - Storage management

## 📈 Future Roadmap

### Q3 2025
- Secondary sale module
- Multi-region onboarding
- Open explorer API

### Q4 2025
- Legal automation layer
- Fiat onramp
- Mobile interface

### 2026+
- DAO extensions
- Institutional dashboards
- Audit modules

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by Nossa Terra Firme
</div>
