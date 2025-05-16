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
      if (name === 'termsAccepted') {
        setFormData(prev => ({ ...prev, termsAccepted: checked }));
      } else if (name === 'hasApp') {
        setFormData(prev => ({
          ...prev,
          environmentalMetadata: {
            ...prev.environmentalMetadata,
            hasApp: checked,
          },
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
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
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'geoJson') {
        setFormData(prev => ({
          ...prev,
          geoJson: files[0]
        }));
      }
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
          <label className="block text-sm font-medium text-evergreen-700 mb-2">
            GeoJSON File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-evergreen-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-evergreen-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-evergreen-600">
                <label
                  htmlFor="geoJson"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-evergreen-600 hover:text-evergreen-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-evergreen-500"
                >
                  <span>Upload GeoJSON</span>
                  <input
                    id="geoJson"
                    name="geoJson"
                    type="file"
                    accept=".geojson,.json"
                    className="sr-only"
                    onChange={handleFileChange}
                    required
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-evergreen-500">
                GeoJSON file up to 10MB
              </p>
            </div>
          </div>
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
            className="bg-gray-200 mt-1 block w-full px-3 py-2 rounded-md border-2 border-evergreen-200 shadow-sm focus:border-evergreen-500 focus:ring-evergreen-500"
          />
        </div>
        <div>
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="hasApp"
              checked={formData.environmentalMetadata.hasApp}
              onChange={handleChange}
              className="rounded border-2 border-evergreen-300 text-evergreen-600 focus:ring-evergreen-500"
            />
            <span className="text-sm font-medium text-evergreen-700">
              According to Brazil’s Forest Code (Law No. 12.651/2012), this property has preserved its legally required Permanent Preservation Areas (APP) and Legal Reserve (RL)
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