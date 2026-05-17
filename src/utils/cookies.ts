/**
 * Cookie utility functions.
 *
 * IMPORTANT: the API sets the real `auth_token` cookie as HttpOnly via its
 * Set-Cookie header on /auth/login. JavaScript cannot read or modify HttpOnly
 * cookies, so:
 *   - `getAuthToken()` will always return `null` in production.
 *   - `setAuthToken(...)` would write a *separate* non-HttpOnly cookie with
 *     the same name; the browser may then send both. Don't call it for the
 *     real auth token.
 *   - `removeAuthToken()` only removes the JS-writable cookie, not the
 *     HttpOnly one (only the server can clear that).
 *
 * These helpers are kept because some consumers (AuthContext, success pages,
 * Header) use `getAuthToken()` as a quick "is there *any* auth cookie state"
 * check. A future cleanup should replace those with a server-side /auth/me
 * call as the source of truth.
 */

const COOKIE_DOMAIN = import.meta.env.VITE_COOKIE_DOMAIN || 'pathofwonders.local';
const COOKIE_NAME = 'auth_token';

/**
 * Set a cookie with the specified value and attributes
 */
export function setCookie(name: string, value: string, days: number = 30): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  // Build cookie string
  let cookieString = `${name}=${encodeURIComponent(value)};`;
  cookieString += `expires=${expires.toUTCString()};`;
  cookieString += `path=/;`;
  cookieString += `domain=${COOKIE_DOMAIN};`;
  cookieString += `SameSite=Lax;`;
  // Note: HttpOnly cannot be set from JavaScript - it must be set by the server
  
  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  
  return null;
}

/**
 * Remove a cookie by name
 */
export function removeCookie(name: string): void {
  // Set cookie with past expiration date
  let cookieString = `${name}=;`;
  cookieString += `expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  cookieString += `path=/;`;
  cookieString += `domain=${COOKIE_DOMAIN};`;
  
  document.cookie = cookieString;
}

/**
 * Set auth token cookie
 */
export function setAuthToken(token: string): void {
  setCookie(COOKIE_NAME, token);
}

/**
 * Get auth token from cookie
 */
export function getAuthToken(): string | null {
  return getCookie(COOKIE_NAME);
}

/**
 * Remove auth token cookie
 */
export function removeAuthToken(): void {
  removeCookie(COOKIE_NAME);
}

