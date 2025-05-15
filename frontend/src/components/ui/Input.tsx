import { forwardRef } from 'react';
import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-evergreen-700">
          {label}
        </label>
        <input
          ref={ref}
          className={`mt-1 block w-full h-10 px-3 py-2 rounded-md border-2 border-evergreen-200 
            shadow-sm focus:border-evergreen-500 focus:ring-evergreen-500
            disabled:opacity-50 disabled:bg-evergreen-50
            ${error ? 'border-red-500' : ''}
            ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-evergreen-700">
          {label}
        </label>
        <select
          ref={ref}
          className={`mt-1 block w-full h-10 px-3 py-2 rounded-md border-2 border-evergreen-200 
            shadow-sm focus:border-evergreen-500 focus:ring-evergreen-500
            disabled:opacity-50 disabled:bg-evergreen-50
            ${error ? 'border-red-500' : ''}
            ${className}`}
          {...props}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
Select.displayName = 'Select';

export { Input, Select }; 