import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface SecondaryButtonProps {
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

export default function SecondaryButton({
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
}: SecondaryButtonProps) {
  const sizeClasses = {
    sm: 'px-6 py-2.5 text-sm font-medium',
    md: 'px-6 py-2.5 text-base font-medium',
    lg: 'px-8 py-3.5 text-lg font-semibold',
  };

  const baseClasses = `rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`;
  
  // Secondary button styles: white background, gradient border, dark blue text
  const secondaryStyles = 'bg-white text-blue-900 hover:bg-blue-50 shadow-md hover:shadow-lg';
  
  // Gradient border style
  const gradientBorderStyle = {
    backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #1e3a8a, #172554)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    border: '2px solid transparent',
  };

  const hoverGradientBorderStyle = {
    backgroundImage: 'linear-gradient(#eff6ff, #eff6ff), linear-gradient(to right, #172554, #1e1b4b)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    border: '2px solid transparent',
  };

  const content = (
    <>
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
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
        className={`${baseClasses} ${secondaryStyles} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        style={gradientBorderStyle}
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
      className={`${baseClasses} ${secondaryStyles} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={gradientBorderStyle}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          Object.assign(e.currentTarget.style, hoverGradientBorderStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          Object.assign(e.currentTarget.style, gradientBorderStyle);
        }
      }}
    >
      {content}
    </button>
  );
}

