import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function PrimaryButton({
  children,
  onClick,
  href,
  disabled = false,
  isLoading = false,
  size = 'md',
  fullWidth = false,
  icon: Icon,
  iconPosition = 'right',
  className = '',
  type = 'button',
}: PrimaryButtonProps) {
  const sizeClasses = {
    sm: 'btn-primary',
    md: 'btn-primary',
    lg: 'btn-primary-lg',
  };

  const baseClasses = `${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {typeof children === 'string' ? 'Loading...' : children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={`${baseClasses} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {content}
    </button>
  );
}

