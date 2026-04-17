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

  const baseClasses = [
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    // Large white glow on desktop (Tailwind wins over `.btn-primary` base shadow via cascade order)
    'lg:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_28px_110px_rgba(255,255,255,0.28)]',
    'lg:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_34px_130px_rgba(255,255,255,0.34)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

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

