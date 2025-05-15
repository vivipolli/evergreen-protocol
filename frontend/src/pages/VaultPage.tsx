import { useState } from 'react';

interface VaultToken {
  id: string;
  name: string;
  description: string;
  image: string;
  value: number;
  hectares: number;
  vegetation: string;
  lockedUntil: string;
}

const mockVaultTokens: VaultToken[] = [
  {
    id: '1',
    name: 'Atlantic Forest Reserve',
    description: 'Beautiful forest reserve with diverse wildlife and natural springs.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
    value: 75000,
    hectares: 150,
    vegetation: 'Atlantic Forest',
    lockedUntil: '2024-12-31',
  },
  {
    id: '2',
    name: 'Amazon Rainforest Plot',
    description: 'Pristine Amazon rainforest area with rich biodiversity.',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    value: 120000,
    hectares: 200,
    vegetation: 'Amazon Rainforest',
    lockedUntil: '2025-06-30',
  },
];

export default function VaultPage() {
  const [tokens, setTokens] = useState<VaultToken[]>(mockVaultTokens);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-evergreen-800 mb-2">Land Token Vault</h1>
        <p className="text-evergreen-600">
          Manage your locked land tokens and track their value.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map(token => (
          <div key={token.id} className="card hover:shadow-eco-lg transition-all duration-300">
            <div className="relative h-48 mb-4">
              <img
                src={token.image}
                alt={token.name}
                className="w-full h-full object-cover rounded-t-eco"
              />
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-evergreen-700 font-semibold">
                {token.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-evergreen-800 mb-2">{token.name}</h3>
              <p className="text-evergreen-600 mb-4 line-clamp-2">{token.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-evergreen-500">Hectares</p>
                  <p className="font-semibold text-evergreen-700">{token.hectares}</p>
                </div>
                <div>
                  <p className="text-sm text-evergreen-500">Vegetation</p>
                  <p className="font-semibold text-evergreen-700">{token.vegetation}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-evergreen-500">
                  Locked until: <span className="font-medium text-evergreen-700">{token.lockedUntil}</span>
                </p>
                <button className="btn-primary">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 