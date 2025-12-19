import { api } from './index';

// Course purchase request interface
export interface CoursePurchaseRequest {
  course_id: number | string;
  name: string;
  email: string;
  promotion_code?: string;
}

// Course purchase response interface
export interface CoursePurchaseResponse {
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
 * Initiate purchase for a course
 * @param courseId - The course ID to purchase
 * @param name - Customer's full name
 * @param email - Customer's email address
 * @param promotionCode - Optional promotion code
 * @returns Promise with purchase response containing checkout URL or session info
 */
export const initiateCoursePurchase = async (
  courseId: number | string,
  name: string,
  email: string,
  promotionCode?: string
): Promise<CoursePurchaseResponse> => {
  try {
    const payload: CoursePurchaseRequest = {
      course_id: courseId,
      name,
      email,
    };

    if (promotionCode) {
      payload.promotion_code = promotionCode;
    }

    const response = await api.post<CoursePurchaseResponse>('courses/purchase', payload);
    return response.data;
  } catch (error) {
    console.error('Error initiating course purchase:', error);
    throw error;
  }
};
