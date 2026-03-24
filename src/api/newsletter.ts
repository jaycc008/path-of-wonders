import axios from 'axios';
import { api } from './index';

/** Request body — align field names with your backend. */
export interface NewsletterSubscribePayload {
  email: string;
}

/**
 * Expected JSON body from POST `/newsletter/subscribe` (after `VITE_API_BASE_URL`).
 * Extend `data` when your backend returns a subscriber id or similar.
 */
export interface NewsletterSubscribeResponse {
  status?: boolean;
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

/** Path segment appended to `api` base URL (e.g. `http://localhost:8000/api/v1/newsletter/subscribe`). */
export const NEWSLETTER_SUBSCRIBE_PATH = 'newsletter/subscribe';

/**
 * Subscribe an email to the newsletter.
 * @throws Error if the response body explicitly sets `status` or `success` to `false`, or on network / HTTP errors.
 */
export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscribeResponse> {
  const payload: NewsletterSubscribePayload = {
    email: email.trim(),
  };

  const response = await api.post<NewsletterSubscribeResponse>(NEWSLETTER_SUBSCRIBE_PATH, payload);
  const data = response.data;

  if (data.status === false || data.success === false) {
    throw new Error(data.message?.trim() || 'Could not complete subscription.');
  }

  return data;
}

/** Map API / network failures to a short user-visible string. */
export function getNewsletterSubscribeErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const res = error.response?.data;
    if (res && typeof res === 'object') {
      const msg = (res as { message?: string }).message;
      if (typeof msg === 'string' && msg.trim()) {
        return msg;
      }
      const detail = (res as { detail?: unknown }).detail;
      if (typeof detail === 'string' && detail.trim()) {
        return detail;
      }
      if (Array.isArray(detail) && detail[0] && typeof (detail[0] as { msg?: string }).msg === 'string') {
        return (detail[0] as { msg: string }).msg;
      }
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
