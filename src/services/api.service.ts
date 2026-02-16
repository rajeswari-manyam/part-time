import axios from "axios";

// ✅ UPDATED: Changed to match your actual backend IP
export const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "";

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
        return response.data; // Returns { message, count, jobs: [...] }
    } catch (error) {
        console.error("Error fetching user jobs:", error);
        throw error;
    }
};// Update this interface in your api.service.ts file

export interface Worker {
    _id: string;
    userId: string;
    name: string;
    email?: string;
    category: string | string[];  // Can be string or array
    subCategories?: string[];
    skills?: string[];
    bio?: string;
    chargeType: "hour" | "day" | "fixed";
    serviceCharge: number;
    latitude: number;
    longitude: number;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    isActive: boolean;
    images?: string[];  // Changed from 'string' to 'string[]'
    profilePic?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
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
// Add these interfaces and functions to your api.service.ts file
// ==================== CREATE WORKER ====================

export const getAllUsers = async (): Promise<{ success: boolean; data: User[] }> => {
    try {
        console.log("Fetching all users...");

        const response = await axios.get(`${API_BASE_URL}/getAllUsers`);

        console.log("getAllUsers response:", response.data);

        return response.data;
    } catch (error: any) {
        console.error("Error fetching all users:", error.response?.data || error.message);

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch users"
        );
    }
};
// ==================== CREATE BOOKING ====================

export interface CreateBookingPayload {
    customer: string;
    worker: string;
    bookingType: "HOURLY" | "DAILY" | "MONTHLY";
    hours?: number;
    days?: number;
    months?: number;
    price: number;
    startDate: string; // YYYY-MM-DD
    remarks?: string;
}

export const createBooking = async (
    payload: CreateBookingPayload
): Promise<{ success: boolean; message: string; data: any }> => {
    try {
        const formData = new URLSearchParams();

        formData.append("customer", payload.customer);
        formData.append("worker", payload.worker);
        formData.append("bookingType", payload.bookingType);
        formData.append("price", String(payload.price));
        formData.append("startDate", payload.startDate);

        if (payload.hours) formData.append("hours", String(payload.hours));
        if (payload.days) formData.append("days", String(payload.days));
        if (payload.months) formData.append("months", String(payload.months));
        if (payload.remarks) formData.append("remarks", payload.remarks);

        const response = await fetch(`${API_BASE_URL}/createBooking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Create booking error:", error);
        throw error;
    }
};

export interface CreateTicketPayload {
    raisedById: string;
    raisedByRole: "User" | "Worker";
    subject: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
}

export interface TicketResponse {
    message: string;
    ticket: {
        _id: string;
        raisedById: string;
        raisedByRole: string;
        subject: string;
        description: string;
        priority: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
}

// Add this function with your other API functions
export const createTicket = async (
    payload: CreateTicketPayload
): Promise<TicketResponse> => {
    try {
        const formData = new URLSearchParams();
        formData.append("raisedById", payload.raisedById);
        formData.append("raisedByRole", payload.raisedByRole);
        formData.append("subject", payload.subject);
        formData.append("description", payload.description);
        formData.append("priority", payload.priority);

        const response = await fetch(`${API_BASE_URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Create Ticket API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Create Ticket response:", data);
        return data;
    } catch (error) {
        console.error("Create ticket error:", error);
        throw error;
    }
};
// ==================== GET TICKETS BY USER ID ====================

export interface GetTicketsResponse {
    message: string;
    tickets: Array<{
        _id: string;
        raisedById: string;
        raisedByRole: string;
        subject: string;
        description: string;
        priority: "LOW" | "MEDIUM" | "HIGH";
        status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
        createdAt: string;
        updatedAt: string;
        __v: number;
    }>;
}

export const getTicketsByUserId = async (
    userId: string,
    userRole: "User" | "Worker"
): Promise<GetTicketsResponse> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/getTicketById/${userId}?raisedById=${userId}&raisedByRole=${userRole}`,
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Get Tickets API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Get Tickets response:", data);
        return data;
    } catch (error) {
        console.error("Get tickets error:", error);
        throw error;
    }
};
// Add these new interfaces and functions to your api.service.ts

// ==================== CREATE WORKER (STEP 1) ====================
export interface CreateWorkerBasePayload {
    userId: string;
    name: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number | string;
    longitude: number | string;
}

export interface CreateWorkerBaseResponse {
    success: boolean;
    message: string;
    worker: {
        _id: string;
        userId: string;
        name: string;
        area: string;
        city: string;
        state: string;
        pincode: string;
        latitude: number;
        longitude: number;
        category: string[];
        subCategories: string[];
        skills: string[];
        serviceCharge: number;
        chargeType: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
}

export const createWorkerBase = async (
    payload: CreateWorkerBasePayload
): Promise<CreateWorkerBaseResponse> => {
    try {
        const formData = new URLSearchParams();
        formData.append("userId", payload.userId);
        formData.append("name", payload.name);
        formData.append("area", payload.area);
        formData.append("city", payload.city);
        formData.append("state", payload.state);
        formData.append("pincode", payload.pincode);
        formData.append("latitude", String(payload.latitude));
        formData.append("longitude", String(payload.longitude));

        const response = await fetch(`${API_BASE_URL}/createworkers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Create Worker Base API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Create Worker Base response:", data);
        return data;
    } catch (error) {
        console.error("Create worker base error:", error);
        throw error;
    }
};

// ==================== ADD WORKER SKILL (STEP 2) ====================
export interface AddWorkerSkillPayload {
    workerId: string;
    category: string | string[]; // Can be single or comma-separated
    subCategory: string;
    skill: string;
    serviceCharge: number;
    chargeType: "hour" | "day" | "fixed";
}

export interface AddWorkerSkillResponse {
    success: boolean;
    message: string;
    skill: {
        _id: string;
        userId: string;
        workerId: string;
        name: string;
        category: string[];
        subCategory: string;
        skill: string;
        serviceCharge: number;
        chargeType: string;
        area: string;
        city: string;
        state: string;
        pincode: string;
        latitude: number;
        longitude: number;
        createdAt: string;
        updatedAt: string;
    };
}

export const addWorkerSkill = async (
    payload: AddWorkerSkillPayload
): Promise<AddWorkerSkillResponse> => {
    try {
        const formData = new URLSearchParams();
        formData.append("workerId", payload.workerId);

        // Handle category - convert array to comma-separated string if needed
        const categoryString = Array.isArray(payload.category)
            ? payload.category.join(",")
            : payload.category;
        formData.append("category", categoryString);

        formData.append("subCategory", payload.subCategory);
        formData.append("skill", payload.skill);
        formData.append("serviceCharge", String(payload.serviceCharge));
        formData.append("chargeType", payload.chargeType);

        const response = await fetch(`${API_BASE_URL}/addworkerSkill`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Add Worker Skill API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}. ${errorText}`);
        }

        const data = await response.json();
        console.log("Add Worker Skill response:", data);
        return data;
    } catch (error) {
        console.error("Add worker skill error:", error);
        throw error;
    }
};

// ==================== COMBINED WORKER CREATION (BOTH STEPS) ====================
export interface CreateWorkerCompletePayload {
    userId: string;
    name: string;
    email?: string;
    category: string | string[];
    subCategory: string;
    skills: string;
    bio?: string;
    serviceCharge: number;
    chargeType: "hour" | "day" | "fixed";
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number | string;
    longitude: number | string;
    images?: File[];
    profilePic?: File;
}

export const createWorkerComplete = async (
    payload: CreateWorkerCompletePayload
): Promise<{
    success: boolean;
    message: string;
    baseWorker: CreateWorkerBaseResponse;
    skillWorker: AddWorkerSkillResponse;
}> => {
    try {
        console.log("📝 Step 1: Creating base worker profile...");

        // Step 1: Create base worker
        const baseWorkerResponse = await createWorkerBase({
            userId: payload.userId,
            name: payload.name,
            area: payload.area,
            city: payload.city,
            state: payload.state,
            pincode: payload.pincode,
            latitude: payload.latitude,
            longitude: payload.longitude,
        });

        if (!baseWorkerResponse.success) {
            throw new Error(baseWorkerResponse.message || "Failed to create base worker");
        }

        const workerId = baseWorkerResponse.worker._id;
        console.log("✅ Base worker created with ID:", workerId);

        console.log("📝 Step 2: Adding worker skills...");

        // Step 2: Add skills to worker
        const skillResponse = await addWorkerSkill({
            workerId,
            category: payload.category,
            subCategory: payload.subCategory,
            skill: payload.skills,
            serviceCharge: payload.serviceCharge,
            chargeType: payload.chargeType,
        });

        if (!skillResponse.success) {
            throw new Error(skillResponse.message || "Failed to add worker skills");
        }

        console.log("✅ Worker skills added successfully");

        return {
            success: true,
            message: "Worker profile created successfully with skills",
            baseWorker: baseWorkerResponse,
            skillWorker: skillResponse,
        };
    } catch (error: any) {
        console.error("❌ Create worker complete error:", error);
        throw error;
    }
};
// Add this to your api.service.ts file

// ==================== GET WORKER WITH SKILLS ====================

export interface WorkerSkillDetail {
    _id: string;
    userId: string;
    workerId: string;
    name: string;
    category: string[];
    subCategory: string;
    skill: string;
    serviceCharge: number;
    chargeType: "hour" | "day" | "fixed";
    profilePic: string;
    images: string[];
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface WorkerWithSkillsResponse {
    success: boolean;
    source: "Worker" | "WorkerSkill";
    worker: {
        _id: string;
        userId: string;
        name: string;
        profilePic: string;
        images: string[];
        area: string;
        city: string;
        state: string;
        pincode: string;
        latitude: number;
        longitude: number;
        serviceCharge: number;
        chargeType: "hour" | "day" | "fixed";
        skills: string[];
        categories: string[][];
        subCategories: string[];
    };
    totalSkills: number;
    workerSkills: WorkerSkillDetail[];
}

export const getWorkerWithSkills = async (
    workerId: string
): Promise<WorkerWithSkillsResponse> => {
    try {
        console.log("🔍 Fetching worker with skills for ID:", workerId);

        const response = await fetch(
            `${API_BASE_URL}/getWorkerWithSkills?workerId=${workerId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Get Worker With Skills API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Worker with skills response:", data);
        return data;
    } catch (error) {
        console.error("❌ Get worker with skills error:", error);
        throw error;
    }
};
export interface WorkerListItem {
    _id: string;
    name: string;
    profilePic: string;
    images: string[];
    skills: string[];
    categories: string[];
    subCategories: string[];
    serviceCharge: number;
    chargeType: "hour" | "day" | "fixed";
    area: string;
    city: string;
    state: string;
    pincode: string;
    totalSkills: number;
}

export const getWorkersWithSkills = async (): Promise<{
    success: boolean;
    count: number;
    workers: WorkerListItem[];
}> => {
    const response = await fetch(`${API_BASE_URL}/getWorkersWithSkills`);
    if (!response.ok) throw new Error("Failed to fetch workers");
    return response.json();
};
// Add these functions to your api.service.ts file

// ==================== GET WORKER SKILL BY ID ====================
export interface WorkerSkillResponse {
    success: boolean;
    workerSkill: {
        _id: string;
        userId: string;
        workerId: string;
        name: string;
        category: string[];
        subCategory: string;
        skill: string;
        serviceCharge: number;
        chargeType: "hour" | "day" | "fixed";
        profilePic: string;
        images: string[];
        area: string;
        city: string;
        state: string;
        pincode: string;
        latitude: number;
        longitude: number;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
}

export const getWorkerSkillById = async (
    skillId: string
): Promise<WorkerSkillResponse> => {
    try {
        console.log("🔍 Fetching worker skill by ID:", skillId);

        const response = await fetch(
            `${API_BASE_URL}/getWorkerSkillById/${skillId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Get Worker Skill By ID API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Worker skill response:", data);
        return data;
    } catch (error) {
        console.error("❌ Get worker skill by ID error:", error);
        throw error;
    }
};

// ==================== UPDATE WORKER SKILL ====================
export interface UpdateWorkerSkillPayload {
    category?: string | string[];
    subCategory?: string;
    skill?: string;
    serviceCharge?: number;
    chargeType?: "hour" | "day" | "fixed";
}
export const updateWorkerSkill = async (
    skillId: string,
    payload: UpdateWorkerSkillPayload
): Promise<WorkerSkillResponse> => {
    try {
        console.log("📝 Updating worker skill:", skillId, payload);

        const formData = new URLSearchParams();

        if (payload.category) {
            const categoryString = Array.isArray(payload.category)
                ? payload.category.join(",")
                : payload.category;
            formData.append("category", categoryString);
        }

        if (payload.subCategory) formData.append("subCategory", payload.subCategory);
        if (payload.skill) formData.append("skill", payload.skill);
        if (payload.serviceCharge !== undefined)
            formData.append("serviceCharge", String(payload.serviceCharge));
        if (payload.chargeType) formData.append("chargeType", payload.chargeType);

        const response = await fetch(
            `${API_BASE_URL}/updateWorkerSkillById/${skillId}`, // ✅ FIXED
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Update Worker Skill API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Update worker skill error:", error);
        throw error;
    }
};

// ==================== DELETE WORKER SKILL ====================
export const deleteWorkerSkill = async (skillId: string): Promise<{ success: boolean; message: string }> => {
    try {
        console.log("🗑️ Deleting worker skill:", skillId);

        const response = await fetch(
            `${API_BASE_URL}/deleteWorkerSkill/${skillId}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Delete Worker Skill API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Worker skill deleted:", data);
        return data;
    } catch (error) {
        console.error("❌ Delete worker skill error:", error);
        throw error;
    }
};
export const getAllJobs = async () => {
    const response = await axios.get(`${API_BASE_URL}/getAllJobs`);
    return response.data;
};



export const getNearbyJobs = async (
    latitude: number,
    longitude: number
) => {
    const res = await fetch(
        `${API_BASE_URL}/getNearbyJobs?latitude=${latitude}&longitude=${longitude}`,
        {
            method: "GET",
            redirect: "follow",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch nearby jobs");
    }

    return res.json();
};