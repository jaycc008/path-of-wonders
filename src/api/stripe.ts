import { api } from './index';

// Stripe Price Details Response
export interface StripePriceResponse {
  status: boolean;
  data: {
    id: string;
    object: string;
    active: boolean;
    currency: string;
    unit_amount: number;
    unit_amount_decimal: string;
    product: string;
    nickname?: string;
    metadata?: { [key: string]: string };
    [key: string]: any;
  };
  message?: string;
}

// Stripe Product Details Response
export interface StripeProductResponse {
  status: boolean;
  data: {
    id: string;
    object: string;
    active: boolean;
    name: string;
    description?: string;
    images?: string[];
    metadata?: { [key: string]: string };
    [key: string]: any;
  };
  message?: string;
}

// Validate Discount Request
export interface ValidateDiscountRequest {
  promotion_code?: string;
  coupon_id?: string;
}

// Validate Discount Response
export interface ValidateDiscountResponse {
  status: boolean;
  data: {
    valid: boolean;
    promotion_code?: string;
    promotion_code_id?: string;
    coupon_id?: string;
    discount_type?: 'amount' | 'percent';
    discount_value?: number; // Amount in cents for amount type, percentage for percent type
    currency?: string;
    duration?: string;
    duration_in_months?: number | null;
    redeem_by?: number;
    times_redeemed?: number;
    max_redemptions?: number | null;
    metadata?: { [key: string]: any };
    message?: string;
    // Legacy fields for backward compatibility
    discount_percent?: number;
    discount_amount?: number;
    [key: string]: any;
  };
  message?: string;
}

/**
 * Get Stripe Price Details
 * @param priceId - Stripe price ID (e.g., "price_1234567890")
 * @returns Promise with Stripe price details
 * 
 * API Endpoint: GET /api/v1/stripe/price/{id}
 * Authentication: Not required (public)
 */
export const getStripePrice = async (priceId: string): Promise<StripePriceResponse> => {
  try {
    const response = await api.get<StripePriceResponse>(`stripe/price/${priceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Stripe price details:', error);
    throw error;
  }
};

/**
 * Get Stripe Product Details
 * @param productId - Stripe product ID (e.g., "prod_1234567890")
 * @returns Promise with Stripe product details
 * 
 * API Endpoint: GET /api/v1/stripe/product/{id}
 * Authentication: Not required (public)
 */
export const getStripeProduct = async (productId: string): Promise<StripeProductResponse> => {
  try {
    const response = await api.get<StripeProductResponse>(`stripe/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Stripe product details:', error);
    throw error;
  }
};

// Promotion Code Details Response
export interface PromotionCodeResponse {
  status: boolean;
  message?: string;
  data: {
    promotion_code: string;
    promotion_code_id: string;
    [key: string]: any;
  };
}

/**
 * Get Stripe Promotion Code Details
 * @param promotionCodeId - Stripe promotion code ID (e.g., "promo_1234567890")
 * @returns Promise with promotion code details
 * 
 * API Endpoint: GET /api/v1/stripe/promotion-code/{id}
 * Authentication: Not required (public)
 */
export const getPromotionCode = async (promotionCodeId: string): Promise<PromotionCodeResponse> => {
  try {
    const response = await api.get<PromotionCodeResponse>(`stripe/promotion-code/${promotionCodeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching promotion code details:', error);
    throw error;
  }
};

/**
 * Validate Discount
 * @param request - Request body with promotion_code and/or coupon_id
 * @returns Promise with discount validation response
 * 
 * API Endpoint: POST /api/v1/stripe/validate-discount
 * Authentication: Not required (public)
 * 
 * Note: Provide at least one of promotion_code or coupon_id
 */
export const validateDiscount = async (
  request: ValidateDiscountRequest
): Promise<ValidateDiscountResponse> => {
  try {
    // Validate that at least one field is provided
    if (!request.promotion_code && !request.coupon_id) {
      throw new Error('At least one of promotion_code or coupon_id must be provided');
    }

    const response = await api.post<ValidateDiscountResponse>('stripe/validate-discount', request);
    return response.data;
  } catch (error) {
    console.error('Error validating discount:', error);
    throw error;
  }
};

