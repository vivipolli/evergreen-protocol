import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface LandTokenFormProps {
  onSubmit: (data: any) => void;
}

export default function LandTokenForm({ onSubmit }: LandTokenFormProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    vegetation: '',
    hectares: '',
    waterBodies: '',
    springs: '',
    carRegistry: '',
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (file: File | null) => {
    setForm({ ...form, image: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onSubmit(form);
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-eco shadow-eco p-8 max-w-xl mx-auto flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-evergreen-700 mb-2">Register New Land Token</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Property Name</label>
          <input name="name" id="name" type="text" className="input" placeholder="e.g. Fazenda Esperança" value={form.name} onChange={handleChange} required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="vegetation">Vegetation Cover</label>
          <input name="vegetation" id="vegetation" type="text" className="input" placeholder="e.g. Atlantic Forest" value={form.vegetation} onChange={handleChange} required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hectares">Hectares</label>
          <input name="hectares" id="hectares" type="number" min="0" step="0.01" className="input" placeholder="e.g. 120.5" value={form.hectares} onChange={handleChange} required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="waterBodies">Water Bodies</label>
          <input name="waterBodies" id="waterBodies" type="text" className="input" placeholder="e.g. 2 lakes" value={form.waterBodies} onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="springs">Springs</label>
          <input name="springs" id="springs" type="text" className="input" placeholder="e.g. 1 spring" value={form.springs} onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="carRegistry">CAR Registry</label>
          <input name="carRegistry" id="carRegistry" type="text" className="input" placeholder="e.g. 123.456.789-0" value={form.carRegistry} onChange={handleChange} required />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" className="input min-h-[80px]" placeholder="Describe the property..." value={form.description} onChange={handleChange} required />
      </div>
      <div>
        <ImageUpload value={form.image} onChange={handleImageChange} />
      </div>
      <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
        {loading ? 'Registering...' : 'Register Land Token'}
      </button>
      {success && (
        <div className="text-green-600 text-center font-semibold mt-2">Land token registered successfully (mock)!</div>
      )}
    </form>
  );
} 