import { api } from './index';

// Overview section interface
export interface OverviewSection {
  header: string;
  overview: string; // HTML content
}

// Module interface
export interface Module {
  id: number;
  title: string;
  order?: number;
  chapters?: Chapter[];
  [key: string]: any;
}

// Chapter interface
export interface Chapter {
  id: number;
  title: string;
  order?: number;
  module_id?: number;
  [key: string]: any;
}

// Author interface for book
export interface BookAuthor {
  name: string;
  author_dp_url?: string;
}

// Book interface
export interface Book {
  id: string;
  course_id: string;
  title: string;
  description: string;
  long_description?: string;
  price: number;
  cover_url?: string;
  backcover_url?: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
  author?: BookAuthor;
  status?: string;
  created_at?: string;
  updated_at?: string | null;
}

// Course interface
export interface Course {
  id: number;
  name?: string;
  title?: string;
  description: string;
  image?: string;
  thumbnail_url?: string;
  intro_video_url?: string;
  overview_sections?: OverviewSection[];
  modules?: Module[];
  price: number;
  category?: string;
  instructor?: string;
  rating?: number;
  students_count?: number;
  duration?: string;
  level?: string;
  modules_count?: number;
  chapters_count?: number;
  book?: Book;
  [key: string]: any;
}

// Courses response interface
export interface CoursesResponse {
  status: boolean;
  data: {
    items: Course[];
    pagination?: {
      page: number;
      page_size: number;
      total: number;
      pages: number;
    };
  };
}

// Billing address interface
export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// Course purchase request interface
export interface CoursePurchaseRequest {
  course_id: number | string;
  name: string;
  email: string;
  promotion_code?: string;
  billing_address?: BillingAddress;
  save_address?: boolean;
}

// Course purchase response interface
export interface CoursePurchaseResponse {
  success?: boolean;  // Some APIs use this
  status?: boolean;   // Some APIs use this instead
  message?: string;
  data: {
    checkout_url?: string;
    payment_id?: string;
    session_id?: string;
    payment_intent_id?: string;
    message?: string;
    [key: string]: any;
  };
}

/**
 * Get all courses
 * @returns Promise with courses response
 */
export const getCourses = async (): Promise<CoursesResponse> => {
  try {
    const response = await api.get<CoursesResponse>('courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Single course response interface
export interface CourseResponse {
  status: boolean;
  data: Course;
  message?: string;
}

/**
 * GET /api/v1/courses/{id}
 * Same envelope as the courses list: `data` is a single course object with the same fields
 * as each element in `GET courses` → `data.items[]` (one row, not a different “expanded” shape).
 */
export type CourseDetailsResponse = CourseResponse;

/**
 * Get a single course by ID (legacy name; same as {@link getCourseDetails}).
 * @param courseId - The course ID (UUID string or number)
 * @returns Promise with course response including book data
 */
export const getCourseById = async (courseId: number | string): Promise<CourseResponse> => {
  try {
    const response = await api.get<CourseResponse>(`courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

/**
 * Course details by ID — same path and payload shape as list items:
 * `GET /api/v1/courses/{id}` → `{ status, data: Course, message? }`
 */
export const getCourseDetails = async (
  courseId: number | string
): Promise<CourseDetailsResponse> => getCourseById(courseId);

/**
 * Initiate purchase for a course
 * @param courseId - The course ID to purchase (UUID string or number)
 * @param name - Customer's full name (optional)
 * @param email - Customer's email address (optional)
 * @param promotionCode - Optional promotion code
 * @param billingAddress - Optional billing address (Stripe format)
 * @param saveAddress - Optional flag to save address to user profile
 * @returns Promise with purchase response containing checkout URL
 * 
 * API Endpoint: POST /api/v1/courses/purchase
 * Authentication: Required (Cookie or Bearer token)
 * 
 * Response includes checkout_url for Stripe redirect
 */
export const initiateCoursePurchase = async (
  courseId: number | string,
  name: string,
  email: string,
  promotionCode?: string,
  billingAddress?: BillingAddress,
  saveAddress?: boolean
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

    if (billingAddress) {
      payload.billing_address = billingAddress;
    }

    if (saveAddress !== undefined) {
      payload.save_address = saveAddress;
    }

    const response = await api.post<CoursePurchaseResponse>('courses/purchase', payload);
    return response.data;
  } catch (error) {
    console.error('Error initiating course purchase:', error);
    throw error;
  }
};

// Course purchase success details interface
export interface CoursePurchaseSuccessDetails {
  course_name: string;
  course_description?: string;
  course_thumbnail?: string;
  invoice_url?: string;
  invoice_pdf_url?: string;
  [key: string]: any;
}

// Course purchase success response interface
export interface CoursePurchaseSuccessResponse {
  status: boolean;
  data: CoursePurchaseSuccessDetails;
  message?: string;
}

/**
 * Get course purchase success details by session ID
 * @param sessionId - Stripe checkout session ID
 * @returns Promise with course purchase success details
 */
export const getCoursePurchaseSuccess = async (sessionId: string): Promise<CoursePurchaseSuccessResponse> => {
  try {
    const response = await api.get<CoursePurchaseSuccessResponse>(`courses/success?session_id=${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course purchase success details:', error);
    throw error;
  }
};

// Book response interface
export interface BookResponse {
  status: boolean;
  data: Book;
  message?: string;
}

/**
 * Get book for a specific course
 * @param courseId - The course ID (UUID string or number)
 * @returns Promise with book response
 * 
 * API Endpoint: GET /api/v1/courses/{course_id}/book
 */
export const getCourseBook = async (courseId: number | string): Promise<BookResponse> => {
  try {
    const response = await api.get<BookResponse>(`courses/${courseId}/book`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course book:', error);
    throw error;
  }
};
