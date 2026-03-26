import { SelectHTMLAttributes } from 'react';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export default function FormSelect({ hasError = false, className = '', children, ...props }: FormSelectProps) {
  const stateClasses = hasError
    ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent';

  return (
    <select
      {...props}
      className={`w-full text-sm md:text-base px-3 md:px-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 transition-all ${stateClasses} ${className}`}
    >
      {children}
    </select>
  );
}
