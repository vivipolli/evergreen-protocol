interface MarketplaceFiltersProps {
  onFilterChange: (filters: any) => void;
}

export default function MarketplaceFilters({ onFilterChange }: MarketplaceFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-evergreen-400 mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="priceRange" className="block text-sm font-medium text-gray-300 mb-2">
            Price Range
          </label>
          <select
            id="priceRange"
            name="priceRange"
            className="w-full bg-[#0A1A0A] border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-evergreen-500 focus:border-transparent"
            onChange={handleChange}
          >
            <option value="">Any Price</option>
            <option value="0-10000">$0 - $10,000</option>
            <option value="10000-50000">$10,000 - $50,000</option>
            <option value="50000-100000">$50,000 - $100,000</option>
            <option value="100000+">$100,000+</option>
          </select>
        </div>
        <div>
          <label htmlFor="vegetation" className="block text-sm font-medium text-gray-300 mb-2">
            Vegetation Type
          </label>
          <select
            id="vegetation"
            name="vegetation"
            className="w-full bg-[#0A1A0A] border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-evergreen-500 focus:border-transparent"
            onChange={handleChange}
          >
            <option value="">Any Type</option>
            <option value="atlantic-forest">Atlantic Forest</option>
            <option value="amazon">Amazon Rainforest</option>
            <option value="cerrado">Cerrado</option>
            <option value="pantanal">Pantanal</option>
          </select>
        </div>
        <div>
          <label htmlFor="hectares" className="block text-sm font-medium text-gray-300 mb-2">
            Min. Hectares
          </label>
          <input
            type="number"
            id="hectares"
            name="hectares"
            min="0"
            step="1"
            className="w-full bg-[#0A1A0A] border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-evergreen-500 focus:border-transparent"
            placeholder="e.g. 100"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
} 