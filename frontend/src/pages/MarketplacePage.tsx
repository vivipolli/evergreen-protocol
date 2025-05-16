import { useState } from 'react';
import LandTokenCard from '../components/LandTokenCard';
import MarketplaceFilters from '../components/MarketplaceFilters';

// Mock data for land tokens
const mockTokens = [
  {
    id: '1',
    name: 'Atlantic Forest Reserve',
    description: 'Beautiful forest reserve with diverse wildlife and natural springs.',
    image: '/mata-atlantica.jpeg',
    price: 75000,
    hectares: 150,
    vegetation: 'Atlantic Forest',
    owner: '0x1234...5678',
  },
  {
    id: '2',
    name: 'Amazon Rainforest Plot',
    description: 'Pristine Amazon rainforest area with rich biodiversity.',
    image: '/amazonia.jpeg',
    price: 120000,
    hectares: 200,
    vegetation: 'Amazon Rainforest',
    owner: '0x8765...4321',
  },
  {
    id: '3',
    name: 'Cerrado Conservation Area',
    description: 'Unique Cerrado ecosystem with rare species and water sources.',
    image: '/cerrado.jpeg',
    price: 45000,
    hectares: 100,
    vegetation: 'Cerrado',
    owner: '0x9876...1234',
  },
  {
    id: '4',
    name: 'Pantanal Wetlands',
    description: 'Expansive wetlands with rich aquatic life and bird species.',
    image: '/pantanal.jpeg',
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
          Browse and discover verified land tokens (EVG-L) with complete legal documentation and environmental metrics.
        </p>
      </div>

      <div className="bg-[#0F2A0F] rounded-lg shadow-lg p-6 mb-8">
        <MarketplaceFilters onFilterChange={handleFilterChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTokens.map(token => (
          <LandTokenCard
            key={token.id}
            id={token.id}
            name={token.name}
            description={token.description}
            image={token.image}
            price={token.price}
            hectares={token.hectares}
            vegetation={token.vegetation}
            owner={token.owner}
          />
        ))}
      </div>
    </div>
  );
} 