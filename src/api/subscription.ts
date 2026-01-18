import { api } from './index';

// Discount type definition
export interface Discount {
  subscription_id: string;
  discount_percent: number | null;
  discount_amount: number | null;
  final_price: number | null;
  valid_from: string;
  valid_to: string;
  status: string;
  stripe_coupon_id: string | null;
  stripe_promotion_code_id: string | null;
  id: string;
  created_at: string;
  updated_at: string;
}

// Subscription type definition
export interface Subscription {
  id: string;
  name: string;
  price: number;
  stripe_price_id: string;
  stripe_product_id: string;
  includes: string[];
  duration_days: number;
  status: string;
  type: string;
  created_at: string;
  updated_at: string;
  discount: Discount | null;
}

// Pagination type definition
export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

// Response data structure
export interface SubscriptionsData {
  items: Subscription[];
  pagination: Pagination;
}

// Response type for subscriptions endpoint
export interface SubscriptionsResponse {
  status: boolean;
  data: SubscriptionsData;
}

/**
 * Get all subscriptions
 * @returns Promise with subscriptions response
 */
export const getSubscriptions = async (): Promise<SubscriptionsResponse> => {
  try {
    const response = await api.get<SubscriptionsResponse>('subscriptions');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

/**
 * Get a single subscription (returns the first one if multiple exist)
 * @returns Promise with single subscription or null
 */
export const getSubscription = async (): Promise<Subscription | null> => {
  try {
    const response = await getSubscriptions();
    // Return the first subscription if available
    return response.status && response.data?.items && response.data.items.length > 0 
      ? response.data.items[0] 
      : null;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};

// Billing address interface
export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// Purchase request interface
export interface PurchaseRequest {
  subscription_id: string;
  discount_id?: string;
  promotion_code?: string;
  name: string;
  email: string;
  billing_address?: BillingAddress;
  save_address?: boolean;
}

// Purchase response interface
export interface PurchaseResponse {
  status: boolean;
  data: {
    checkout_url?: string;
    session_id?: string;
    payment_intent_id?: string;
    message?: string;
    [key: string]: any;
  };
  message?: string;
}

/**
 * Initiate purchase for a subscription
 * @param subscriptionId - The subscription ID to purchase
 * @param name - Customer's full name
 * @param email - Customer's email address
 * @param discountId - Optional discount ID if discount is applied
 * @param promotionCode - Optional promotion code
 * @param billingAddress - Optional billing address (Stripe format)
 * @param saveAddress - Optional flag to save address to user profile
 * @returns Promise with purchase response containing checkout URL or session info
 */
export const initiatePurchase = async (
  subscriptionId: string,
  name: string,
  email: string,
  discountId?: string,
  promotionCode?: string,
  billingAddress?: BillingAddress,
  saveAddress?: boolean
): Promise<PurchaseResponse> => {
  try {
    const payload: PurchaseRequest = {
      subscription_id: subscriptionId,
      name,
      email,
    };

    if (discountId) {
      payload.discount_id = discountId;
    }

    if (promotionCode) {
      payload.promotion_code = promotionCode;
    }

    if (billingAddress) {
      payload.billing_address = billingAddress;
    }

    if (saveAddress !== undefined) {
      payload.save_address = saveAddress;
    }

    const response = await api.post<PurchaseResponse>('subscriptions/purchase', payload);
    return response.data;
  } catch (error) {
    console.error('Error initiating purchase:', error);
    throw error;
  }
};

// Subscription success details interface
export interface SubscriptionSuccessDetails {
  subscription_name: string;
  course_thumbnail?: string;
  course_name: string;
  course_description?: string;
  invoice_url?: string;
  invoice_pdf_url?: string;
  [key: string]: any;
}

// Subscription success response interface
export interface SubscriptionSuccessResponse {
  status: boolean;
  data: SubscriptionSuccessDetails;
  message?: string;
}

/**
 * Get subscription success details by session ID
 * @param sessionId - Stripe checkout session ID
 * @returns Promise with subscription success details
 */
export const getSubscriptionSuccess = async (sessionId: string): Promise<SubscriptionSuccessResponse> => {
  try {
    const response = await api.get<SubscriptionSuccessResponse>(`subscriptions/success?session_id=${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription success details:', error);
    throw error;
  }
};

