import axios from 'axios';
import { api } from './index';

/** Request body — align field names with your backend. */
export interface NewsletterSubscribePayload {
  email: string;
}

/**
 * Expected JSON body from POST `/api/v1/newsletters`.
 */
export interface NewsletterResponse {
  id: string;
  email: string;
  status: 'active';
  created_at: string;
  updated_at: string | null;
}

/**
 * Subscribe an email to the newsletter.
 * @throws Error if the response body explicitly sets `status` or `success` to `false`, or on network / HTTP errors.
 */
export async function subscribeToNewsletter(email: string): Promise<NewsletterResponse> {
  const payload: NewsletterSubscribePayload = {
    email: email.trim(),
  };

  const response = await api.post<NewsletterResponse>('newsletters', payload);
  return response.data as NewsletterResponse;
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
