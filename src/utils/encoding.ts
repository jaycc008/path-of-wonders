/**
 * Safely encode UTF-8 strings to base64
 * Handles characters outside the Latin1 range that btoa() cannot handle
 */
export const encodeToBase64 = (str: string): string => {
  try {
    // First encode to UTF-8 bytes, then to base64
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  } catch (error) {
    // Fallback: use encodeURIComponent if btoa fails
    console.warn('[Encoding] btoa failed, using encodeURIComponent fallback:', error);
    return encodeURIComponent(str);
  }
};

/**
 * Safely decode base64 to UTF-8 string
 * Handles UTF-8 characters that atob() cannot handle directly
 */
export const decodeFromBase64 = (str: string): string => {
  try {
    // First decode base64, then decode UTF-8
    return decodeURIComponent(
      atob(str)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  } catch (error) {
    // Fallback: try direct decode if it's not base64
    try {
      return decodeURIComponent(str);
    } catch {
      console.warn('[Encoding] Decode failed:', error);
      return str;
    }
  }
};

