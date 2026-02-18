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

