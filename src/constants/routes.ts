/**
 * Application route constants
 * Centralized route definitions to avoid hardcoded URLs throughout the codebase
 */

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CHECKOUT: '/checkout',
  BOOK_CHECKOUT: '/book-checkout',
  COURSES: '/courses',
  COURSE_DETAILS: (id: string | number) => `/courses/${id}`,
  SUBSCRIPTION_SUCCESS: '/subscription/success',
  COURSE_PURCHASE_SUCCESS: '/course/success',
} as const;

/**
 * Build book checkout URL with encoded book data as query parameter
 * @param encodedBook - Base64 encoded book data
 * @returns Complete checkout URL with query parameter
 */
export const buildBookCheckoutUrl = (encodedBook: string): string => {
  return `${ROUTES.BOOK_CHECKOUT}?book=${encodeURIComponent(encodedBook)}`;
};

