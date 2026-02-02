// src/services/ShoppingService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface ShoppingStore {
  _id?: string;
  userId?: string;
  storeName?: string;
  storeType?: string;
  email?: string;
  phone?: string;
  description?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ShoppingResponse {
  success: boolean;
  count: number;
  data: ShoppingStore[];
}

/**
 * Fetch nearby shopping/retail stores
 * @param latitude number
 * @param longitude number
 * @returns Promise<ShoppingResponse>
 */
export const getNearbyShoppingStores = async (
  latitude: number,
  longitude: number,
  distance: number
): Promise<ShoppingResponse> => {
  if (!distance || distance <= 0) {
    throw new Error("Please provide a valid distance in km");
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/getNearbyShoppingRetail?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ShoppingResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shopping stores:", error);
    return { success: false, count: 0, data: [] };
  }
};
