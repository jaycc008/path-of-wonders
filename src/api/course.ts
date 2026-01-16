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
