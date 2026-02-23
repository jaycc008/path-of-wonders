/**
 * Cookie utility functions
 * Note: HttpOnly cookies cannot be set from JavaScript - they must be set by the server.
 * This utility sets cookies with Domain, Path, and SameSite attributes.
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

