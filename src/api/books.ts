import { api } from './index';
import { Book } from './course';

// Book response interface
export interface BookResponse {
  status: boolean;
  data: Book;
  message?: string;
}

// Shipping address interface for book cost estimation request
export interface ShippingAddress {
  city: string;
  country_code: string;
  postcode: string;
  state_code: string;
  street1: string;
  phone_number: string;
}

// Suggested address interface
export interface SuggestedAddress {
  country_code: string;
  state_code: string | null;
  postcode: number;
  city: string;
  street1: string;
  street2: string | null;
}

// Warning interface
export interface AddressWarning {
  type: string;
  code: string;
  path: string;
  message: string;
}

// Shipping address in response (includes additional fields)
export interface ShippingAddressResponse {
  city: string;
  country: string;
  country_code?: string; // May be present in some cases
  is_business: boolean;
  first_name: string;
  last_name: string;
  name?: string; // Legacy field, may not be present
  phone_number: string;
  postcode: string;
  state: string;
  state_code?: string; // May be present in some cases
  street1: string;
  street2?: string | null;
  warnings?: AddressWarning[];
  suggested_address?: SuggestedAddress;
}

// Discount interface
export interface Discount {
  amount: string;
  description: string;
}

// Fee interface
export interface Fee {
  currency: string;
  fee_type: string;
  sku: string;
  tax_rate: string;
  total_cost_excl_tax: string;
  total_cost_incl_tax: string;
  total_tax: string;
}

// Cost with tax interface
export interface CostWithTax {
  tax_rate: string;
  total_cost_excl_tax: string;
  total_cost_incl_tax: string;
  total_tax: string;
}

// Line item cost interface
export interface LineItemCost {
  cost_excl_discounts: string;
  discounts: Discount[];
  quantity: number;
  tax_rate: string;
  total_cost_excl_discounts: string;
  total_cost_excl_tax: string;
  total_cost_incl_tax: string;
  total_tax: string;
  unit_tier_cost: string | null;
}

// Book cost estimation request interface
export interface BookCostEstimationRequest {
  shipping_address: ShippingAddress;
  quantity: number;
}

// Book cost estimation response data interface
export interface BookCostEstimationResponseData {
  shipping_address: ShippingAddressResponse;
  currency: string;
  fees?: Fee[];
  fulfillment_cost: CostWithTax;
  line_item_costs: LineItemCost[];
  shipping_cost: CostWithTax;
  total_cost_excl_tax: string;
  total_cost_incl_tax: string;
  total_discount_amount: string;
  total_tax: string;
}

// Book cost estimation response interface (wrapped in status/data structure)
export interface BookCostEstimationResponse {
  status: boolean;
  data: BookCostEstimationResponseData;
  message?: string;
}

/**
 * Get cost estimation for a book purchase
 * @param bookId - The book ID (UUID string or number)
 * @param shippingAddress - Shipping address details
 * @param quantity - Number of books to purchase
 * @returns Promise with cost estimation response
 * 
 * API Endpoint: POST /api/v1/books/{book_id}/cost-estimation
 * Authentication: Not required (public)
 * 
 * Response includes shipping_address, currency, fees, fulfillment_cost,
 * line_item_costs, shipping_cost, total_cost_excl_tax, total_cost_incl_tax,
 * total_discount_amount, and total_tax
 */
export const getBookCostEstimation = async (
  bookId: number | string,
  shippingAddress: ShippingAddress,
  quantity: number = 1
): Promise<BookCostEstimationResponseData> => {
  try {
    const payload: BookCostEstimationRequest = {
      shipping_address: shippingAddress,
      quantity,
    };

    const response = await api.post<BookCostEstimationResponse>(
      `books/${bookId}/cost-estimation`,
      payload
    );
    // Return the data portion of the response
    return response.data.data;
  } catch (error) {
    console.error('Error fetching book cost estimation:', error);
    throw error;
  }
};

// Book purchase request interface
export interface BookPurchaseRequest {
  address_id: string; // UUID as string
  quantity: number; // Minimum 1, default 1
  fulfillment_type: 'lulu' | 'direct'; // Fulfillment type: lulu for international, direct for India
}

// Checkout session response interface
export interface CheckoutSessionResponse {
  payment_id: string; // UUID as string
  checkout_url: string;
  stripe_session_id: string;
}

// Book purchase response interface
export interface BookPurchaseResponse {
  status: boolean;
  data: CheckoutSessionResponse;
  message?: string;
}

/**
 * Purchase a book
 * @param bookId - The book ID (UUID string or number)
 * @param addressId - User's shipping address ID (UUID string)
 * @param quantity - Number of books to purchase (default: 1, minimum: 1)
 * @param fulfillmentType - Fulfillment type: 'lulu' for international orders, 'direct' for India (default: 'lulu')
 * @returns Promise with purchase response containing checkout URL
 * 
 * API Endpoint: POST /api/v1/books/{book_id}/purchase
 * Authentication: Required (Cookie or Bearer token)
 * Status Code: 201 Created
 * 
 * Gets Lulu cost estimation (for lulu), creates pending payment, and creates Stripe checkout with custom amount.
 * For direct fulfillment (India), backend handles everything and returns checkout URL.
 * Response includes checkout_url for Stripe redirect, payment_id, and stripe_session_id
 */
export const purchaseBook = async (
  bookId: number | string,
  addressId: string,
  quantity: number = 1,
  fulfillmentType: 'lulu' | 'direct' = 'lulu'
): Promise<BookPurchaseResponse> => {
  try {
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    const payload: BookPurchaseRequest = {
      address_id: addressId,
      quantity,
      fulfillment_type: fulfillmentType,
    };

    const response = await api.post<BookPurchaseResponse>(
      `books/${bookId}/purchase`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error purchasing book:', error);
    throw error;
  }
};

// Payment details interface
export interface PaymentDetails {
  id: string;
  user_id: string;
  payment_type: string;
  status: string;
  amount: number;
  stripe_payment_id: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

// Order details interface
export interface OrderDetails {
  id: string;
  user_id: string;
  book_id: string;
  payment_id: string;
  address_id: string;
  status: string;
  fulfillment_type: 'lulu' | 'direct';
  lulu_print_job_id: string | null;
  lulu_status: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  carrier: string | null;
  shipping_method: string | null;
  created_at: string;
  updated_at: string;
}

// Address details interface
export interface AddressDetails {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  landmark: string | null;
  status: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Book purchase success details interface
export interface BookPurchaseSuccessDetails {
  session_id: string;
  payment_status: string;
  status: string;
  amount_total: number;
  currency: string;
  payment: PaymentDetails;
  order: OrderDetails;
  book: {
    id: string;
    course_id: string;
    title: string;
    description: string;
    long_description: string;
    price: number;
    cover_url: string;
    author: {
      name: string;
      author_dp_url: string;
    };
    status: string;
    created_at: string;
    updated_at: string | null;
  };
  address: AddressDetails;
}

// Book purchase success response interface
export interface BookPurchaseSuccessResponse {
  status: boolean;
  data: BookPurchaseSuccessDetails;
  message?: string;
}

/**
 * Get book purchase success details by session ID
 * @param sessionId - Stripe checkout session ID
 * @returns Promise with book purchase success details
 */
export const getBookPurchaseSuccess = async (sessionId: string): Promise<BookPurchaseSuccessResponse> => {
  try {
    const response = await api.get<BookPurchaseSuccessResponse>(`books/success?session_id=${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book purchase success details:', error);
    throw error;
  }
};

