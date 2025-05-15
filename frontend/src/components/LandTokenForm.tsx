import { useState } from 'react';
import { Input, Select } from './ui/Input';

interface LandTokenFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export default function LandTokenForm({ onSubmit, isSubmitting }: LandTokenFormProps) {
  const [formData, setFormData] = useState({
    carNumber: '',
    carStatus: '',
    propertyName: '',
    geoJson: null as File | null,
    commitmentHash: '',
    environmentalMetadata: {
      vegetationCover: '',
      hasApp: false,
      appDetails: '',
      hectares: '',
      waterBodies: '',
      springs: '',
      description: '',
    },
    termsAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.startsWith('environmentalMetadata.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        environmentalMetadata: {
          ...prev.environmentalMetadata,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        geoJson: e.target.files![0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CAR Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-evergreen-700">CAR Information</h3>
        <Input
          label="CAR Number"
          id="carNumber"
          name="carNumber"
          value={formData.carNumber}
          onChange={handleChange}
          required
        />
        <Select
          label="CAR Status"
          id="carStatus"
          name="carStatus"
          value={formData.carStatus}
          onChange={handleChange}
          required
          options={[
            { value: '', label: 'Select status' },
            { value: 'regular', label: 'Regular' },
            { value: 'pending', label: 'Pending' },
            { value: 'irregular', label: 'Irregular' },
          ]}
        />
      </div>

      {/* Property Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-evergreen-700">Property Information</h3>
        <Input
          label="Property Name"
          id="propertyName"
          name="propertyName"
          value={formData.propertyName}
          onChange={handleChange}
          required
        />
        <div>
          <label htmlFor="geoJson" className="block text-sm font-medium text-evergreen-700">
            Property Area (GeoJSON)
          </label>
          <input
            type="file"
            id="geoJson"
            name="geoJson"
            accept=".geojson,.json"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full h-10 px-3 py-2 text-sm text-evergreen-600 rounded-md
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-evergreen-50 file:text-evergreen-700
              hover:file:bg-evergreen-100"
          />
        </div>
      </div>

      {/* Environmental Metadata */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-evergreen-700">Environmental Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Vegetation Cover"
            id="vegetationCover"
            name="environmentalMetadata.vegetationCover"
            value={formData.environmentalMetadata.vegetationCover}
            onChange={handleChange}
            required
            options={[
              { value: '', label: 'Select coverage' },
              { value: 'dense', label: 'Dense Forest' },
              { value: 'medium', label: 'Medium Forest' },
              { value: 'sparse', label: 'Sparse Forest' },
              { value: 'none', label: 'No Forest' },
            ]}
          />
          <Input
            label="Area (Hectares)"
            id="hectares"
            name="environmentalMetadata.hectares"
            type="number"
            value={formData.environmentalMetadata.hectares}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
          <Input
            label="Water Bodies"
            id="waterBodies"
            name="environmentalMetadata.waterBodies"
            value={formData.environmentalMetadata.waterBodies}
            onChange={handleChange}
            placeholder="e.g. 2 lakes"
          />
          <Input
            label="Springs"
            id="springs"
            name="environmentalMetadata.springs"
            value={formData.environmentalMetadata.springs}
            onChange={handleChange}
            placeholder="e.g. 1 spring"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-evergreen-700">
            Description
          </label>
          <textarea
            id="description"
            name="environmentalMetadata.description"
            value={formData.environmentalMetadata.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 rounded-md border-2 border-evergreen-200 shadow-sm focus:border-evergreen-500 focus:ring-evergreen-500"
          />
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="environmentalMetadata.hasApp"
              checked={formData.environmentalMetadata.hasApp}
              onChange={handleChange}
              className="rounded border-2 border-evergreen-300 text-evergreen-600 focus:ring-evergreen-500"
            />
            <span className="text-sm font-medium text-evergreen-700">
              Has Permanent Preservation Area (APP)
            </span>
          </label>
        </div>
        {formData.environmentalMetadata.hasApp && (
          <div>
            <label htmlFor="appDetails" className="block text-sm font-medium text-evergreen-700">
              APP Details
            </label>
            <textarea
              id="appDetails"
              name="environmentalMetadata.appDetails"
              value={formData.environmentalMetadata.appDetails}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 rounded-md border-2 border-evergreen-200 shadow-sm focus:border-evergreen-500 focus:ring-evergreen-500"
            />
          </div>
        )}
      </div>

      {/* Commitment Hash */}
      <Input
        label="Commitment Contract Hash"
        id="commitmentHash"
        name="commitmentHash"
        value={formData.commitmentHash}
        onChange={handleChange}
        required
      />

      {/* Terms Acceptance */}
      <div>
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            required
            className="mt-1 rounded border-2 border-evergreen-300 text-evergreen-600 focus:ring-evergreen-500"
          />
          <span className="text-sm text-evergreen-700">
            I accept the legal responsibility for the veracity of the submitted data and commit to forest preservation as per the standard terms.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border-2 border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-evergreen-600 hover:bg-evergreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-evergreen-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Token...' : 'Create Land Token'}
        </button>
      </div>
    </form>
  );
} 