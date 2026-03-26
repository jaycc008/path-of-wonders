import { useState, useEffect, memo } from 'react';
import { CheckCircle2, Loader2, Tag, X } from 'lucide-react';
import { validateDiscount, getPromotionCode } from '../api/stripe';
import { Discount } from '../api/subscription';
import FormInput from './forms/fields/FormInput';

interface CouponDiscountInfo {
  code: string;
  discount_type?: 'amount' | 'percent';
  discount_value?: number; // Amount in cents for amount type, percentage for percent type
  currency?: string;
}

interface CouponInputProps {
  discount?: Discount | null;
  onCouponApplied?: (discountInfo: CouponDiscountInfo) => void;
  onCouponRemoved?: () => void;
  disabled?: boolean;
}

const CouponInput = memo(({ 
  discount, 
  onCouponApplied, 
  onCouponRemoved,
  disabled = false 
}: CouponInputProps) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isFetchingPromoCode, setIsFetchingPromoCode] = useState(false);
  const [hasPreFilledCode, setHasPreFilledCode] = useState(false);

  // Fetch and populate promotion code from subscription discount if available
  useEffect(() => {
    const promoCodeId = discount?.stripe_promotion_code_id;
    if (promoCodeId && !appliedCoupon && !couponCode) {
      const fetchAndApplyPromotionCode = async () => {
        setIsFetchingPromoCode(true);
        setCouponMessage(null);

        try {
          // Get promotion code details from API
          const promotionResponse = await getPromotionCode(promoCodeId);
          
          if (promotionResponse.status && promotionResponse.data?.promotion_code) {
            const promotionCode = promotionResponse.data.promotion_code;
            // Auto-apply the promotion code from subscription without validation
            setCouponCode(promotionCode);
            setAppliedCoupon(promotionCode);
            setHasPreFilledCode(false);
            setIsFetchingPromoCode(false);
            // For subscription discount, we don't have discount info from validation
            // Pass the code, discount info will come from subscription discount object
            onCouponApplied?.({
              code: promotionCode,
              discount_type: discount?.discount_percent ? 'percent' : discount?.discount_amount ? 'amount' : undefined,
              discount_value: discount?.discount_percent ? discount.discount_percent : discount?.discount_amount ? discount.discount_amount * 100 : undefined, // Convert to cents
              currency: 'usd'
            });
          } else {
            throw new Error('Failed to retrieve promotion code details');
          }
        } catch (error: any) {
          const errorMessage = 
            error.response?.data?.detail || 
            error.response?.data?.message || 
            error.message || 
            'Failed to load promotion code. Please try again.';
          setCouponMessage({ 
            type: 'error', 
            text: errorMessage
          });
          setHasPreFilledCode(false);
          setIsFetchingPromoCode(false);
        }
      };
      fetchAndApplyPromotionCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discount?.stripe_promotion_code_id]);

  const handleApplyCoupon = async (codeToValidate?: string) => {
    const code = codeToValidate || couponCode.trim();
    
    if (!code) {
      setCouponMessage({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    setIsApplyingCoupon(true);
    setCouponMessage(null);

    try {
      const response = await validateDiscount({
        promotion_code: code
      });

      if (response.status && response.data?.valid) {
        setAppliedCoupon(code);
        setHasPreFilledCode(false);
        setCouponMessage({ 
          type: 'success', 
          text: response.data.message || 'Coupon applied successfully!' 
        });
        // Pass discount information to parent
        onCouponApplied?.({
          code: code,
          discount_type: response.data.discount_type,
          discount_value: response.data.discount_value,
          currency: response.data.currency || 'usd'
        });
      } else {
        setCouponMessage({ 
          type: 'error', 
          text: response.data?.message || response.message || 'Invalid coupon code' 
        });
        setAppliedCoupon(null);
        onCouponRemoved?.();
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.message || 
        'Failed to validate coupon. Please try again.';
      setCouponMessage({ 
        type: 'error', 
        text: errorMessage
      });
      setAppliedCoupon(null);
      onCouponRemoved?.();
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage(null);
    setHasPreFilledCode(false);
    onCouponRemoved?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCouponCode(value);
    setCouponMessage(null);
    if (hasPreFilledCode) {
      setHasPreFilledCode(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 text-blue-600" />
        Have a Coupon Code?
      </h2>
      {appliedCoupon ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-900">Coupon Applied</p>
                <p className="text-sm text-green-700">{appliedCoupon}</p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-700 hover:text-green-900 transition-colors"
              aria-label="Remove coupon"
              disabled={disabled}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative flex gap-3">
            <div className="flex-1 relative">
              <FormInput
                type="text"
                id="coupon"
                name="coupon"
                value={couponCode}
                onChange={handleInputChange}
                placeholder={isFetchingPromoCode ? "Loading promotion code..." : "Enter coupon code"}
                className={`pr-10 uppercase ${
                  hasPreFilledCode ? 'border-green-500 bg-green-50' : ''
                } ${isFetchingPromoCode ? 'opacity-60' : ''}`}
                disabled={isApplyingCoupon || isFetchingPromoCode || disabled}
              />
              {isFetchingPromoCode && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
              )}
              {!isFetchingPromoCode && hasPreFilledCode && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>
            <button
              onClick={() => handleApplyCoupon()}
              disabled={isApplyingCoupon || !couponCode.trim() || disabled}
              className="px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isApplyingCoupon ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Applying...</span>
                </>
              ) : (
                'Apply'
              )}
            </button>
          </div>
          {couponMessage && (
            <div className={`p-3 rounded-lg text-sm ${
              couponMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {couponMessage.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

CouponInput.displayName = 'CouponInput';

export default CouponInput;

