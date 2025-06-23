// Address service for automatic address fetching and management

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  fullAddress: string;
  lat: number;
  lng: number;
}

export interface LocationData {
  address: Address;
  formattedAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

/**
 * Get current location with automatic address fetching
 */
export const getCurrentLocationWithAddress = async (): Promise<LocationData> => {
  try {
    // Get current position
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      });
    });

    const { latitude, longitude } = position.coords;

    // Reverse geocode to get address
    const address = await reverseGeocode(latitude, longitude);

    return {
      address,
      formattedAddress: address.fullAddress,
      coordinates: { lat: latitude, lng: longitude },
    };
  } catch (error) {
    console.error('Error getting location with address:', error);
    throw new Error('Failed to get current location and address');
  }
};

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<Address> => {
  try {
    // Use OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address data');
    }

    const data = await response.json();
    const address = data.address;

    return {
      street: address?.road || address?.house_number || '',
      city: address?.city || address?.town || address?.village || '',
      state: address?.state || '',
      country: address?.country || '',
      postalCode: address?.postcode || '',
      fullAddress: data.display_name || '',
      lat,
      lng,
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    
    // Fallback to basic address structure
    return {
      street: 'Current Location',
      city: 'Unknown',
      state: 'Unknown',
      country: 'Unknown',
      postalCode: '',
      fullAddress: 'Current Location',
      lat,
      lng,
    };
  }
};

/**
 * Search for addresses based on query
 */
export const searchAddresses = async (query: string): Promise<Address[]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=en`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search addresses');
    }

    const data = await response.json();
    
    return data.map((item: any) => ({
      street: item.address?.road || item.address?.house_number || '',
      city: item.address?.city || item.address?.town || item.address?.village || '',
      state: item.address?.state || '',
      country: item.address?.country || '',
      postalCode: item.address?.postcode || '',
      fullAddress: item.display_name || '',
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('Error searching addresses:', error);
    return [];
  }
};

/**
 * Validate address format
 */
export const validateAddress = (address: Partial<Address>): boolean => {
  return !!(address.city && address.country);
};

/**
 * Format address for display
 */
export const formatAddress = (address: Address): string => {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
};

/**
 * Get address from coordinates with caching
 */
const addressCache = new Map<string, Address>();

export const getCachedAddress = async (lat: number, lng: number): Promise<Address> => {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  
  if (addressCache.has(key)) {
    return addressCache.get(key)!;
  }

  const address = await reverseGeocode(lat, lng);
  addressCache.set(key, address);
  
  return address;
}; 