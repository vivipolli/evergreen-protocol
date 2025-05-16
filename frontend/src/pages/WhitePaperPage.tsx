import React from 'react';

export default function WhitePaperPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#0F2A0F] rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-evergreen-400 mb-2">Evergreen Protocol – White Paper</h1>
        <p className="text-gray-400 mb-8">Version 1.0 | Last updated: May 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-evergreen-400 mb-4">Executive Summary</h2>
          <p className="text-gray-300 leading-relaxed">
            The Evergreen Protocol is an open infrastructure standard built on the Solana blockchain, enabling the tokenization, sale, and fractional ownership of forested land as real-world assets (RWA). It bridges the gap between environmental conservation, property regularization, and crypto-native finance by providing a unified, permissionless framework to mint verified land as NFTs, store and trade them securely, and offer fractional investment through a yield-oriented stablecoin vault.
          </p>
          <p className="text-gray-300 leading-relaxed mt-4">
            Designed for scale, credibility, and legal anchoring, Evergreen operates with modular logic: each parcel of land is tokenized via the Evergreen Registry, traded and acquired via the Evergreen Marketplace, and optionally fractionalized through the Evergreen Vault, which issues fungible shares backed by verified land.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-evergreen-400 mb-4">1. Vision</h2>
          <p className="text-gray-300 leading-relaxed">
            Forest lands across the Global South are threatened not only by deforestation, but by a lack of accessible capital, legal clarity, and scalable conservation incentives. Evergreen Protocol was created to:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
            <li>Make land stewardship economically viable and legally traceable;</li>
            <li>Enable trustless transactions of natural assets with verifiable metadata;</li>
            <li>Catalyze a new generation of land-backed financial instruments that are transparent, regenerative, and open to all.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-evergreen-400 mb-4">2. Core Components</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-evergreen-600 mb-3">2.1 Evergreen Registry</h3>
            <p className="text-gray-600 italic mb-3">"From geolocation to tokenization"</p>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Registry module transforms forest land into an on-chain asset using a streamlined minting flow.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong>Token Standard:</strong> EVG-L (Evergreen Land Token) — NFT compliant with Solana SPL standards</li>
              <li><strong>Minting Criteria:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Valid Cadastro Ambiental Rural (CAR) number (Brazil's rural land registry)</li>
                  <li>Geospatial polygon of the area (GeoJSON or IPFS)</li>
                  <li>Hashes of legal documents, preservation commitment letters, optional notarial proof</li>
                  <li>Environmental attributes (e.g., % canopy cover, presence of water bodies, deforestation history)</li>
                  <li>Timestamp, wallet address, and license terms</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-evergreen-600 mb-3">2.2 Evergreen Vault</h3>
            <p className="text-gray-600 italic mb-3">"Fractional, liquid exposure to land-backed value"</p>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Evergreen Vault acts as a stablecoin-denominated vault that acquires EVG-L tokens and issues fungible shares called EVG-S.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong>Token Standard:</strong> EVG-S (Evergreen Share Token) — fungible SPL token</li>
              <li><strong>Accepted Asset:</strong> USDC</li>
              <li><strong>Primary Functions:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Buy and custody verified EVG-L tokens</li>
                  <li>Issue EVG-S to depositors representing pro-rata claim on the vault's land portfolio</li>
                  <li>Enable eventual redemption of value via secondary sales or land-based income streams</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-evergreen-600 mb-3">2.3 Evergreen Marketplace</h3>
            <p className="text-gray-600 italic mb-3">"Discover and transact verified land"</p>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Evergreen Marketplace is the user interface layer — a read-only MVP with interactive potential in later versions.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Browsing of all tokenized EVG-L assets</li>
              <li>Search filters by geography, biome, carbon density, area, owner</li>
              <li>Display of legal docs, IPFS hash, and environmental metrics</li>
              <li>API support for RWA dashboards, real estate apps, or ESG compliance tools</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-evergreen-400 mb-4">3. Legal Anchoring</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Evergreen Protocol blends Web3 transparency with traditional legal frameworks. While token transfers occur on-chain, each EVG-L token is:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Anchored to a signed legal agreement of property transfer or co-management;</li>
            <li>Backed by a CAR number or equivalent state-recognized registration;</li>
            <li>Linked to an off-chain commitment to execute legal transfer, hosted via IPFS and hashed on-chain;</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-evergreen-400 mb-4">4. Value Proposition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0A1A0A] p-4 rounded-lg">
              <h3 className="font-semibold text-evergreen-400 mb-2">For Landowners</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-300">
                <li>Monetize protected lands via direct sale or vault acquisition</li>
                <li>Gain visibility and traceability of their conservation area</li>
              </ul>
            </div>
            <div className="bg-[#0A1A0A] p-4 rounded-lg">
              <h3 className="font-semibold text-evergreen-400 mb-2">For Impact Investors</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-300">
                <li>Participate in transparent land-backed instruments</li>
                <li>Gain access to long-term yield through appreciation and verified ecosystem services</li>
              </ul>
            </div>
            <div className="bg-[#0A1A0A] p-4 rounded-lg">
              <h3 className="font-semibold text-evergreen-400 mb-2">For Builders & Governments</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-300">
                <li>Fork the Registry to develop local public infrastructure</li>
                <li>Deploy trusted registries for environmental land policies</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-evergreen-400 mb-4">5. Roadmap</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#0A1A0A]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phase</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-[#0F2A0F] divide-y divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-evergreen-400">MVP</td>
                  <td className="px-6 py-4 text-sm text-gray-300">Mint EVG-L NFTs, deploy Vault, demo deposit & issuance of EVG-S, build frontend</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-evergreen-400">Q3 2025</td>
                  <td className="px-6 py-4 text-sm text-gray-300">Secondary sale module, multi-region onboarding, open explorer API</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-evergreen-400">Q4 2025</td>
                  <td className="px-6 py-4 text-sm text-gray-300">Legal automation layer, fiat onramp, mobile interface</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-evergreen-400">2026+</td>
                  <td className="px-6 py-4 text-sm text-gray-300">DAO extensions, institutional dashboards, audit modules</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-evergreen-400 mb-4">6. Technical Stack</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li><strong>Blockchain Layer:</strong> Solana (high throughput, low latency, low cost)</li>
            <li><strong>Smart Contract Framework:</strong> Anchor</li>
            <li><strong>Token Standards:</strong> SPL NFT (EVG-L), SPL Token (EVG-S)</li>
            <li><strong>Storage:</strong> IPFS via Web3.storage or Pinata</li>
            <li><strong>Frontend:</strong> React + Phantom Wallet integration</li>
            <li><strong>Security:</strong> All programs audited before mainnet deployment</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-evergreen-400 mb-4">7. Open Source and Licensing</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Evergreen Protocol is open-source under MIT License</li>
            <li>All smart contracts, schema definitions, and UI components are hosted at: <a href="https://github.com/nossaterrafirme/evergreen-protocol" className="text-evergreen-600 hover:text-evergreen-700">https://github.com/nossaterrafirme/evergreen-protocol</a></li>
            <li>Contributions, forks, and local adaptations are welcomed</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-evergreen-400 mb-4">8. Team & Governance</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Nossa Terra Firme leads the development of Evergreen Protocol, leveraging over 9 years of experience in environmental governance, blockchain systems, and land-use innovation.
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            The protocol is maintained by a professional operator team with specializations in:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Environmental law and land titling</li>
            <li>Solana blockchain engineering</li>
            <li>DeFi architecture and RWA tokenization</li>
            <li>Latin American and Global South territorial policy</li>
          </ul>
          <p className="text-gray-300 leading-relaxed mt-4">
            No DAO is planned for initial governance. Strategic decisions are executed by the protocol maintainer and disclosed publicly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-evergreen-400 mb-4">9. Contact & Collaboration</h2>
          <p className="text-gray-300 leading-relaxed">
            To join Evergreen's ecosystem or deploy a custom fork, please contact us through our GitHub repository or official channels.
          </p>
        </section>
      </div>
    </div>
  );
} 