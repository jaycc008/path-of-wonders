import { api } from '../api';

export interface UserInfo {
  email: string;
  name: string;
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
  
  // Try addresses array first
  if (userData?.addresses && Array.isArray(userData.addresses) && userData.addresses.length > 0) {
    const defaultAddress = userData.addresses.find((addr: any) => addr.is_default === true) || userData.addresses[0];
    billingAddress = getAddress(defaultAddress);
  } else if (userData?.billing_address || userData?.address) {
    billingAddress = getAddress(userData.billing_address || userData.address);
  }

  return {
    email: userData?.email || '',
    name: userData?.name || '',
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

