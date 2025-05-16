import { useState } from 'react';
import LandTokenCard from '../components/LandTokenCard';
import MarketplaceFilters from '../components/MarketplaceFilters';

// Mock data for land tokens
const mockTokens = [
  {
    id: '1',
    name: 'Atlantic Forest Reserve',
    description: 'Beautiful forest reserve with diverse wildlife and natural springs.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
    price: 75000,
    hectares: 150,
    vegetation: 'Atlantic Forest',
    owner: '0x1234...5678',
  },
  {
    id: '2',
    name: 'Amazon Rainforest Plot',
    description: 'Pristine Amazon rainforest area with rich biodiversity.',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    price: 120000,
    hectares: 200,
    vegetation: 'Amazon Rainforest',
    owner: '0x8765...4321',
  },
  {
    id: '3',
    name: 'Cerrado Conservation Area',
    description: 'Unique Cerrado ecosystem with rare species and water sources.',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    price: 45000,
    hectares: 100,
    vegetation: 'Cerrado',
    owner: '0x9876...1234',
  },
  {
    id: '4',
    name: 'Pantanal Wetlands',
    description: 'Expansive wetlands with rich aquatic life and bird species.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    price: 95000,
    hectares: 180,
    vegetation: 'Pantanal',
    owner: '0x5678...9012',
  },
];

export default function MarketplacePage() {
  const [filters, setFilters] = useState({
    priceRange: '',
    vegetation: '',
    hectares: '',
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-evergreen-400 mb-2">Land Token Marketplace</h1>
        <p className="text-gray-300">
          Browse and invest in land tokens from various ecosystems.
        </p>
      </div>

      <div className="bg-[#0F2A0F] rounded-lg shadow-lg p-6 mb-8">
        <MarketplaceFilters onFilterChange={handleFilterChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTokens.map(token => (
          <div key={token.id} className="bg-[#0F2A0F] rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="relative h-48">
              <img
                src={token.image}
                alt={token.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A0A] to-transparent opacity-60"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-evergreen-400 mb-2">{token.name}</h3>
              <p className="text-gray-300 mb-4">{token.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-lg font-semibold text-evergreen-400">${token.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Area</p>
                  <p className="text-lg font-semibold text-evergreen-400">{token.hectares} ha</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{token.vegetation}</span>
                <span className="text-sm text-gray-400">{token.owner}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 