interface LandTokenCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  hectares: number;
  vegetation: string;
  owner: string;
}

export default function LandTokenCard({
  name,
  description,
  image,
  price,
  hectares,
  vegetation,
  owner,
}: LandTokenCardProps) {
  return (
    <div className="card hover:shadow-eco-lg transition-all duration-300 bg-gray-300">
      <div className="relative h-48 mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-t-eco"
        />
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-evergreen-700 font-semibold">
          {price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-evergreen-800 mb-2">{name}</h3>
        <p className="text-evergreen-600 mb-4 line-clamp-2">{description}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-evergreen-500">Hectares</p>
            <p className="font-semibold text-evergreen-700">{hectares}</p>
          </div>
          <div>
            <p className="text-sm text-evergreen-500">Vegetation</p>
            <p className="font-semibold text-evergreen-700">{vegetation}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-evergreen-500">
            Owner: <span className="font-medium text-evergreen-700">{owner}</span>
          </p>
          <button className="btn-primary">Buy Token</button>
        </div>
      </div>
    </div>
  );
} 