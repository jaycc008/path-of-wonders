import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export default function FormInput({ hasError = false, className = '', ...props }: FormInputProps) {
  const stateClasses = hasError
    ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent';

  return (
    <input
      {...props}
      className={`w-full text-sm md:text-base px-3 md:px-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 transition-all ${stateClasses} ${className}`}
    />
  );
}
