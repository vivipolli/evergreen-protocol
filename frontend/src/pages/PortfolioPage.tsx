import { useState } from 'react';

interface PortfolioToken {
  id: string;
  name: string;
  description: string;
  image: string;
  currentValue: number;
  initialValue: number;
  hectares: number;
  vegetation: string;
  purchaseDate: string;
  performance: number;
}

const mockPortfolioTokens: PortfolioToken[] = [
  {
    id: '1',
    name: 'Atlantic Forest Reserve',
    description: 'Beautiful forest reserve with diverse wildlife and natural springs.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
    currentValue: 85000,
    initialValue: 75000,
    hectares: 150,
    vegetation: 'Atlantic Forest',
    purchaseDate: '2023-12-01',
    performance: 13.33,
  },
  {
    id: '2',
    name: 'Amazon Rainforest Plot',
    description: 'Pristine Amazon rainforest area with rich biodiversity.',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    currentValue: 135000,
    initialValue: 120000,
    hectares: 200,
    vegetation: 'Amazon Rainforest',
    purchaseDate: '2023-10-15',
    performance: 12.50,
  },
];

export default function PortfolioPage() {
  const [tokens, setTokens] = useState<PortfolioToken[]>(mockPortfolioTokens);

  const totalValue = tokens.reduce((sum, token) => sum + token.currentValue, 0);
  const totalPerformance = tokens.reduce((sum, token) => sum + token.performance, 0) / tokens.length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-white">
          Track your land token investments and their performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-300 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Portfolio Value</h2>
          <p className="text-3xl font-bold text-gray-900">
            {totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
        </div>
        <div className="bg-gray-300 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Average Performance</h2>
          <p className="text-3xl font-bold text-gray-900">
            {totalPerformance.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map(token => (
          <div key={token.id} className="bg-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative h-48 mb-4">
              <img
                src={token.image}
                alt={token.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-gray-800 font-semibold">
                {token.currentValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{token.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{token.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Hectares</p>
                  <p className="font-semibold text-gray-700">{token.hectares}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vegetation</p>
                  <p className="font-semibold text-gray-700">{token.vegetation}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Initial Value</p>
                  <p className="font-medium text-gray-700">
                    {token.initialValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Performance</p>
                  <p className={`font-medium ${token.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {token.performance >= 0 ? '+' : ''}{token.performance.toFixed(2)}%
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Purchase Date</p>
                  <p className="font-medium text-gray-700">{token.purchaseDate}</p>
                </div>
              </div>
              <button className="w-full bg-evergreen-600 text-white py-2 px-4 rounded-lg hover:bg-evergreen-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 