const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/* =========================
   TYPES
========================= */
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

export interface SingleShoppingResponse {
  success: boolean;
  message?: string;
  data?: ShoppingStore;
}

export interface CreateShoppingResponse {
  success: boolean;
  message: string;
  data?: ShoppingStore;
}

/* =========================
   CREATE SHOPPING STORE
========================= */
export const createShoppingStore = async (
  payload: ShoppingStore
): Promise<CreateShoppingResponse> => {
  try {
    const formData = new URLSearchParams();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await fetch(`${API_BASE_URL}/shoppingRetailCreate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating shopping store:", error);
    return {
      success: false,
      message: "Failed to create shopping store",
    };
  }
};

/* =========================
   GET NEARBY SHOPPING STORES
========================= */
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching nearby shopping stores:", error);
    return { success: false, count: 0, data: [] };
  }
};

/* =========================
   GET ALL SHOPPING RETAIL
========================= */
export const getAllShoppingRetail = async (): Promise<ShoppingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getAllShoppingRetail`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching all shopping retail:", error);
    return { success: false, count: 0, data: [] };
  }
};

/* =========================
   GET SHOPPING RETAIL BY ID
========================= */
export const getShoppingRetailById = async (
  storeId: string
): Promise<SingleShoppingResponse> => {
  if (!storeId) {
    throw new Error("Store ID is required");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/getShoppingRetailById/${storeId}`,
      {
        method: "GET",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching shopping retail by id:", error);
    return {
      success: false,
      message: "Failed to fetch shopping retail details",
    };
  }
};
/* =========================
   DELETE SHOPPING RETAIL
========================= */
export interface DeleteShoppingResponse {
  success: boolean;
  message: string;
}

export const deleteShoppingRetail = async (
  storeId: string
): Promise<DeleteShoppingResponse> => {
  if (!storeId) {
    throw new Error("Store ID is required");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/deleteShoppingRetail/${storeId}`,
      {
        method: "DELETE",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting shopping retail:", error);
    return {
      success: false,
      message: "Failed to delete shopping retail",
    };
  }
};
export interface UserStoresResponse {
  success: boolean;
  count: number;
  data: ShoppingStore[];
}

export const getUserStores = async (
  userId: string,
  storeType?: string,
  storeName?: string
): Promise<UserStoresResponse> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const queryParams = new URLSearchParams();

    queryParams.append("userId", userId);

    if (storeType) {
      queryParams.append("storeType", storeType);
    }

    if (storeName) {
      queryParams.append("storeName", storeName);
    }

    const response = await fetch(
      `${API_BASE_URL}/getUserStores?${queryParams.toString()}`,
      {
        method: "GET",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user stores:", error);
    return {
      success: false,
      count: 0,
      data: [],
    };
  }
};
