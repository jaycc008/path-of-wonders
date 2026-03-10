import { api } from '../api';

export interface UserInfo {
  email: string;
  name: string;
  phone?: string;
  billingAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
}

export const extractUserInfo = (userObj: any): UserInfo => {
  const userData = userObj?.data || userObj;
  // Support profile API returning data at top level or under .user
  const profile = userData?.user || userData;
  const addresses = profile?.addresses ?? userData?.addresses;

  const countryMap: {[key: string]: string} = {
    'India': 'IN',
    'United States': 'US',
    'United States of America': 'US',
    'Canada': 'CA',
    'United Kingdom': 'GB',
    'Australia': 'AU'
  };

  const getAddress = (address: any) => {
    if (!address) return null;
    
    const countryValue = address.country || 'US';
    const countryCode = countryMap[countryValue] || countryValue;
    
    return {
      addressLine1: address.line1 || address.address_line1 || address.street || '',
      addressLine2: address.line2 || address.address_line2 || address.street2 || '',
      city: address.city || '',
      state: address.state || address.state_province || '',
      postalCode: address.postal_code || address.postal || address.zip || '',
      country: countryCode,
    };
  };

  let billingAddress = null;
  let phone = profile?.phone || profile?.phone_number || userData?.phone || userData?.phone_number || '';

  // Try addresses array first (profile API returns addresses with address_line1, postal_code, phone_number, etc.)
  if (addresses && Array.isArray(addresses) && addresses.length > 0) {
    const defaultAddress = addresses.find((addr: any) => addr.is_default === true) || addresses[0];
    billingAddress = getAddress(defaultAddress);
    // Use phone_number from the default address when available
    if (defaultAddress?.phone_number) {
      phone = defaultAddress.phone_number;
    }
  } else if (profile?.billing_address || profile?.address || userData?.billing_address || userData?.address) {
    const addr = profile?.billing_address || profile?.address || userData?.billing_address || userData?.address;
    billingAddress = getAddress(addr);
    if (addr?.phone_number) {
      phone = addr.phone_number;
    }
  }

  return {
    email: profile?.email || userData?.email || '',
    name: profile?.name || userData?.name || '',
    phone: phone || '',
    billingAddress,
  };
};

export const getUserInfo = (user: any): UserInfo => {
  if (user) {
    return extractUserInfo(user);
  }
  
  // Fallback to stored user
  const storedUser = api.getUser();
  if (storedUser) {
    return extractUserInfo(storedUser);
  }
  
  return {
    email: '',
    name: '',
    billingAddress: null,
  };
};

