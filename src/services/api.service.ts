import axios from "axios";

// ✅ UPDATED: Changed to match your actual backend IP
export const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://192.168.1.13:3000";

// Axios instance for x-www-form-urlencoded requests
const API_FORM = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
});

// Axios instance for multipart/form-data (file uploads)
const API_MULTIPART = axios.create({
    baseURL: API_BASE_URL,
});


interface RegisterWithOtpParams {
    phone: string;
    name: string;
    latitude: number;
    longitude: number;
}

interface VerifyOtpParams {
    phone: string;
    otp: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    otp?: string;
    data?: any;
    token?: string;
    user?: {
        id: string;
        phone: string;
        name: string;
        token?: string;
    };
}

// ✅ Register and send OTP
export const registerWithOtp = async (params: RegisterWithOtpParams): Promise<ApiResponse> => {
    try {
        const formData = new URLSearchParams();
        formData.append("phone", params.phone);
        formData.append("name", params.name);
        formData.append("latitude", params.latitude.toString());
        formData.append("longitude", params.longitude.toString());

        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Register API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Registration response:", data);
        return data;
    } catch (error) {
        console.error("Register with OTP error:", error);
        throw error;
    }
};

// ✅ Verify OTP
export const verifyOtp = async (params: VerifyOtpParams): Promise<ApiResponse> => {
    try {
        const formData = new URLSearchParams();
        formData.append("phone", params.phone);
        formData.append("otp", params.otp);

        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Verify OTP API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Verify OTP response:", data);
        return data;
    } catch (error) {
        console.error("Verify OTP error:", error);
        throw error;
    }
};

// ✅ Resend OTP
export const resendOtp = async (phone: string): Promise<ApiResponse> => {
    try {
        const formData = new URLSearchParams();
        formData.append("phone", phone);

        const response = await fetch(`${API_BASE_URL}/resend-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Resend OTP API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Resend OTP response:", data);
        return data;
    } catch (error) {
        console.error("Resend OTP error:", error);
        throw error;
    }
};
export interface CreateJobPayload {
    userId: string;
    title: string;
    description: string;
    category: string;
    subcategory?: string;
    jobType: "FULL_TIME" | "PART_TIME";
    servicecharges: string;
    startDate: string;
    endDate: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number | string;
    longitude: number | string;
    images?: File[];
}

export const createJob = async (data: CreateJobPayload) => {
    const formData = new FormData();

    formData.append("userId", data.userId);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);

    if (data.subcategory) {
        formData.append("subcategory", data.subcategory);
    }

    formData.append("jobType", data.jobType);
    formData.append("servicecharges", data.servicecharges);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("area", data.area);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("pincode", data.pincode);
    formData.append("latitude", String(data.latitude));
    formData.append("longitude", String(data.longitude));

    if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
            formData.append("images", file);
        });
    }

    const response = await API_MULTIPART.post("/jobcreate", formData);
    return response.data;
};

export const getJobById = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getJobById/${id}`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const getAllJobs = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAllJobs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all jobs:", error);
        throw error;
    }
};

export const deleteJob = async (jobId: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/deleteJob/${jobId}`)
        return response.data
    }
    catch (error) {
        console.error("Error deleting job:", error)
        throw error
    }
};

export interface UpdateJobPayload {
    title?: string;
    description?: string;
    category?: string;
    latitude?: number | string;
    longitude?: number | string;
    images?: File[];
}

export const updateJob = async (jobId: string, payload: any) => {
    const formData = new FormData();

    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    if (payload.category) formData.append("category", payload.category);
    if (payload.subcategory) formData.append("subcategory", payload.subcategory);
    if (payload.price) formData.append("price", payload.price);
    if (payload.location) formData.append("location", payload.location);
    if (payload.latitude) formData.append("latitude", payload.latitude.toString());
    if (payload.longitude) formData.append("longitude", payload.longitude.toString());

    if (payload.images && payload.images.length > 0) {
        payload.images.forEach((image: File) => {
            formData.append("images", image);
        });
    }

    const response = await fetch(`${API_BASE_URL}/updateJob/${jobId}`, {
        method: "PUT",
        body: formData,
    });

    return response.json();
};

export const getNearbyWorkers = async (
    latitude: number,
    longitude: number,
    range: number,
    category: string,
    subcategory: string
) => {
    const cleanCategory = category.trim();
    const cleanSubcategory = subcategory.trim();

    const url = `${API_BASE_URL}/getNearbyWorkers?latitude=${latitude}&longitude=${longitude}&range=${range}&category=${encodeURIComponent(cleanCategory)}&subcategory=${encodeURIComponent(cleanSubcategory)}`;

    console.log('Fetching workers with URL:', url);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
};

export const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
};

export interface GetNearbyWorkersParams {
    latitude: number;
    longitude: number;
    range?: number;
}

export const getAllWorkers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAllWorkers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all workers:", error);
        throw error;
    }
};

export const getUserJobs = async (userId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getUserJobs`, {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user jobs:", error);
        throw error;
    }
};

export interface Worker {
    _id: string;
    name: string;
    email: string;
    category: string;
    chargeType: string;
    serviceCharge: number;
    latitude: number;
    longitude: number;
    isActive: boolean;
    images: string;
    profilePic: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export const getWorkerById = async (workerId: string): Promise<{ success: boolean; data: Worker }> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getWorkerById/${workerId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching worker by ID:", error);
        throw error;
    }
};

// Fixed API functions - Replace in api.service.ts

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    phone?: string;
    category?: string;
    subCategory?: string;
    latitude?: number | string;
    longitude?: number | string;
    role?: string;
    profilePic?: File;
}

export interface User {
    _id: string;
    phone: string;
    name: string;
    email?: string;
    latitude?: string;
    longitude?: string;
    profilePic?: string;
    isVerified?: boolean;
    createdAt: string;
    updatedAt: string;
}

// ✅ Get User By ID - with proper error handling
export const getUserById = async (userId: string): Promise<{ success: boolean; data: User }> => {
    try {
        console.log("Fetching user:", userId);

        const response = await axios.get(`${API_BASE_URL}/getUserById/${userId}`);

        console.log("getUserById response:", response.data);

        return response.data;
    } catch (error: any) {
        console.error("Error fetching user by ID:", error.response?.data || error.message);

        // Re-throw with more context
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch user data"
        );
    }
};

// ✅ Update User By ID - Always use multipart/form-data
export const updateUserById = async (
    userId: string,
    payload: UpdateUserPayload
) => {
    try {
        console.log("=== UPDATE USER START ===");
        console.log("User ID:", userId);
        console.log("Payload:", payload);

        // Always use multipart/form-data for consistency
        const formData = new FormData();

        // Add all fields to FormData
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (value instanceof File) {
                    console.log(`Adding file: ${key} = ${value.name}`);
                    formData.append(key, value);
                } else {
                    console.log(`Adding field: ${key} = ${value}`);
                    formData.append(key, String(value));
                }
            }
        });

        // Log FormData contents (for debugging)
        console.log("FormData entries:", {
            hasName: formData.has('name'),
            hasLatitude: formData.has('latitude'),
            hasLongitude: formData.has('longitude'),
            hasProfilePic: formData.has('profilePic')
        });

        // Make the request
        const response = await axios.put(
            `${API_BASE_URL}/updateUserById/${userId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        console.log("Update response:", response.data);
        console.log("=== UPDATE USER END ===");

        return response.data;
    } catch (error: any) {
        console.error("=== UPDATE USER ERROR ===");
        console.error("Error details:", error.response?.data || error.message);
        console.error("Status:", error.response?.status);

        // Provide detailed error information
        if (error.response) {
            throw new Error(
                error.response.data?.message ||
                `Server error: ${error.response.status} - ${error.response.statusText}`
            );
        } else if (error.request) {
            throw new Error("No response from server. Please check your connection.");
        } else {
            throw new Error(error.message || "Failed to update profile");
        }
    }
};
const GOOGLE_MAPS_API_KEY = "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8";

// Existing: getUserLocation and getNearbyWorkers remain unchanged

export const getNearbyPlaces = async (
    lat: number,
    lng: number,
    type: string,  // 'restaurant', 'cafe', 'store', etc.
    radius = 5000
) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;

    // For dev: use a CORS proxy. In production, call via backend
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await response.json();
    return data.results;
};
