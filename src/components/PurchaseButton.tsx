import { ArrowRight, ShoppingCart } from 'lucide-react';
import PrimaryButton from './PrimaryButton';

interface PurchaseButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  fulfillmentType?: 'lulu' | 'direct';
  totalAmount?: number;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export default function PurchaseButton({
  onClick,
  disabled = false,
  isLoading = false,
  fulfillmentType = 'lulu',
  totalAmount,
  size = 'lg',
  fullWidth = true,
  className = '',
}: PurchaseButtonProps) {
  const getButtonLabel = () => {
    if (isLoading) {
      return 'Processing...';
    }

    const amountText = totalAmount ? ` - $${totalAmount.toFixed(2)}` : '';
    
    if (fulfillmentType === 'direct') {
      return `Complete Purchase${amountText}`;
    }
    
    return `Proceed to Payment${amountText}`;
  };

  const getIcon = () => {
    if (fulfillmentType === 'direct') {
      return ShoppingCart;
    }
    return ArrowRight;
  };

  return (
    <PrimaryButton
      onClick={onClick}
      disabled={disabled}
      isLoading={isLoading}
      size={size}
      fullWidth={fullWidth}
      icon={getIcon()}
      iconPosition="right"
      className={className}
    >
      {getButtonLabel()}
    </PrimaryButton>
  );
}

