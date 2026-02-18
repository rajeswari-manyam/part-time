import axios from "axios";

export const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "";

const API_FORM = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
});

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

export const registerWithOtp = async (params: RegisterWithOtpParams): Promise<ApiResponse> => {
    try {
        const formData = new URLSearchParams();
        formData.append("phone", params.phone);
        formData.append("name", params.name);
        formData.append("latitude", params.latitude.toString());
        formData.append("longitude", params.longitude.toString());

        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Register with OTP error:", error);
        throw error;
    }
};

export const verifyOtp = async (params: VerifyOtpParams): Promise<ApiResponse> => {
    try {
        const formData = new URLSearchParams();
        formData.append("phone", params.phone);
        formData.append("otp", params.otp);

        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Verify OTP error:", error);
        throw error;
    }
};

export const resendOtp = async (phone: string): Promise<ApiResponse> => {
    try {
        const formData = new URLSearchParams();
        formData.append("phone", phone);

        const response = await fetch(`${API_BASE_URL}/resend-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
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
    if (data.subcategory) formData.append("subcategory", data.subcategory);
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
    if (data.images?.length) {
        data.images.forEach((file) => formData.append("images", file));
    }

    const response = await API_MULTIPART.post("/jobcreate", formData);
    return response.data;
};

export const getJobById = async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/getJobById/${id}`);
    return response.data;
};

export const deleteJob = async (jobId: string) => {
    const response = await axios.delete(`${API_BASE_URL}/deleteJob/${jobId}`);
    return response.data;
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
    if (payload.images?.length) {
        payload.images.forEach((image: File) => formData.append("images", image));
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
    const url = `${API_BASE_URL}/getNearbyWorkers?latitude=${latitude}&longitude=${longitude}&range=${range}&category=${encodeURIComponent(category.trim())}&subcategory=${encodeURIComponent(subcategory.trim())}`;
    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};

export const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }),
            (error) => reject(error)
        );
    });
};

export const getAllWorkers = async () => {
    const response = await axios.get(`${API_BASE_URL}/getAllWorkers`);
    return response.data;
};

export const getUserJobs = async (userId: string) => {
    const response = await axios.get(`${API_BASE_URL}/getUserJobs`, { params: { userId } });
    return response.data;
};

export interface Worker {
    _id: string;
    userId: string;
    name: string;
    email?: string;
    category: string | string[];
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
    images?: string[];
    profilePic?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export const getWorkerById = async (workerId: string): Promise<{ success: boolean; data: Worker }> => {
    const response = await axios.get(`${API_BASE_URL}/getWorkerById/${workerId}`);
    return response.data;
};

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

export const getUserById = async (userId: string): Promise<{ success: boolean; data: User }> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getUserById/${userId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch user data");
    }
};

export const updateUserById = async (userId: string, payload: UpdateUserPayload) => {
    try {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value instanceof File ? value : String(value));
            }
        });

        const response = await axios.put(`${API_BASE_URL}/updateUserById/${userId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
            throw new Error("No response from server. Please check your connection.");
        } else {
            throw new Error(error.message || "Failed to update profile");
        }
    }
};

export const getAllUsers = async (): Promise<{ success: boolean; data: User[] }> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAllUsers`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch users");
    }
};

export interface CreateBookingPayload {
    customer: string;
    worker: string;
    bookingType: "HOURLY" | "DAILY" | "MONTHLY";
    hours?: number;
    days?: number;
    months?: number;
    price: number;
    startDate: string;
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
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });
        if (!response.ok) throw new Error(await response.text());
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

export const createTicket = async (payload: CreateTicketPayload): Promise<TicketResponse> => {
    try {
        const formData = new URLSearchParams();
        formData.append("raisedById", payload.raisedById);
        formData.append("raisedByRole", payload.raisedByRole);
        formData.append("subject", payload.subject);
        formData.append("description", payload.description);
        formData.append("priority", payload.priority);

        const response = await fetch(`${API_BASE_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Create ticket error:", error);
        throw error;
    }
};

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
            `${API_BASE_URL}/getTicketById/${userId}?raisedById=${userId}&raisedByRole=${userRole}`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Get tickets error:", error);
        throw error;
    }
};

// ==================== CREATE WORKER (STEP 1) ====================
// FIX: Use multipart/form-data to support profilePic file upload
export interface CreateWorkerBasePayload {
    userId: string;
    name: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number | string;
    longitude: number | string;
    profilePic?: File; // ✅ ADDED: profilePic file support (matches Postman)
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
        // ✅ FIX: Use FormData (multipart/form-data) instead of URLSearchParams
        // Reason: API accepts profilePic file upload (confirmed in Postman test)
        const formData = new FormData();
        formData.append("userId", payload.userId);
        formData.append("name", payload.name);
        formData.append("area", payload.area);
        formData.append("city", payload.city);
        formData.append("state", payload.state);
        formData.append("pincode", payload.pincode);
        formData.append("latitude", String(payload.latitude));
        formData.append("longitude", String(payload.longitude));

        // ✅ FIX: Attach profilePic if provided
        if (payload.profilePic) {
            formData.append("profilePic", payload.profilePic);
        }

        // ✅ FIX: No Content-Type header — browser sets it automatically with boundary
        const response = await fetch(`${API_BASE_URL}/createworkers`, {
            method: "POST",
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
// FIX: Use multipart/form-data to support images file upload
export interface AddWorkerSkillPayload {
    workerId: string;
    category: string | string[];
    subCategory: string;
    skill: string;
    serviceCharge: number;
    chargeType: "hour" | "day" | "fixed";
    images?: File[]; // ✅ ADDED: images file support (matches Postman)
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
        // ✅ FIX: Use FormData (multipart/form-data) instead of URLSearchParams
        // Reason: API accepts images file uploads (confirmed in Postman test)
        const formData = new FormData();
        formData.append("workerId", payload.workerId);

        // Handle category array → comma-separated string
        const categoryString = Array.isArray(payload.category)
            ? payload.category.join(",")
            : payload.category;
        formData.append("category", categoryString);

        formData.append("subCategory", payload.subCategory);
        formData.append("skill", payload.skill);
        formData.append("serviceCharge", String(payload.serviceCharge));
        formData.append("chargeType", payload.chargeType);

        // ✅ FIX: Attach each image file if provided
        if (payload.images?.length) {
            payload.images.forEach((file) => formData.append("images", file));
        }

        // ✅ FIX: No Content-Type header — browser sets it automatically with boundary
        const response = await fetch(`${API_BASE_URL}/addworkerSkill`, {
            method: "POST",
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

        const baseWorkerResponse = await createWorkerBase({
            userId: payload.userId,
            name: payload.name,
            area: payload.area,
            city: payload.city,
            state: payload.state,
            pincode: payload.pincode,
            latitude: payload.latitude,
            longitude: payload.longitude,
            profilePic: payload.profilePic, // ✅ FIX: Pass profilePic through
        });

        if (!baseWorkerResponse.success) {
            throw new Error(baseWorkerResponse.message || "Failed to create base worker");
        }

        const workerId = baseWorkerResponse.worker._id;
        console.log("✅ Base worker created with ID:", workerId);

        console.log("📝 Step 2: Adding worker skills...");

        const skillResponse = await addWorkerSkill({
            workerId,
            category: payload.category,
            subCategory: payload.subCategory,
            skill: payload.skills,
            serviceCharge: payload.serviceCharge,
            chargeType: payload.chargeType,
            images: payload.images, // ✅ FIX: Pass images through
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
        const response = await fetch(
            `${API_BASE_URL}/getWorkerWithSkills?workerId=${workerId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
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
        const response = await fetch(
            `${API_BASE_URL}/getWorkerSkillById/${skillId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
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
        const formData = new URLSearchParams();
        if (payload.category) {
            formData.append("category", Array.isArray(payload.category)
                ? payload.category.join(",")
                : payload.category);
        }
        if (payload.subCategory) formData.append("subCategory", payload.subCategory);
        if (payload.skill) formData.append("skill", payload.skill);
        if (payload.serviceCharge !== undefined)
            formData.append("serviceCharge", String(payload.serviceCharge));
        if (payload.chargeType) formData.append("chargeType", payload.chargeType);

        const response = await fetch(`${API_BASE_URL}/updateWorkerSkillById/${skillId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("❌ Update worker skill error:", error);
        throw error;
    }
};

// ==================== DELETE WORKER SKILL ====================
export const deleteWorkerSkill = async (
    skillId: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/deleteWorkerSkill/${skillId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("❌ Delete worker skill error:", error);
        throw error;
    }
};

export const getAllJobs = async () => {
    const response = await axios.get(`${API_BASE_URL}/getAllJobs`);
    return response.data;
};

export const getNearbyJobs = async (latitude: number, longitude: number) => {
    const res = await fetch(
        `${API_BASE_URL}/getNearbyJobs?latitude=${latitude}&longitude=${longitude}`,
        { method: "GET", redirect: "follow" }
    );
    if (!res.ok) throw new Error("Failed to fetch nearby jobs");
    return res.json();
};

// ==================== GET NEARBY JOBS FOR WORKER ====================
export interface JobDetail {
    _id: string;
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
    latitude: number;
    longitude: number;
    images?: string[];
    distance?: number;
    createdAt: string;
    updatedAt: string;
}

export interface NearbyJobsForWorkerResponse {
    success: boolean;
    message: string;
    count: number;
    jobs: JobDetail[];
}

export const getNearbyJobsForWorker = async (
    workerId: string
): Promise<NearbyJobsForWorkerResponse> => {
    try {
        console.log("🔍 Fetching nearby jobs for worker ID:", workerId);

        // ✅ Correct
        const response = await fetch(
            `${API_BASE_URL}/getNearbyJobsWorker/${workerId}`,
            {
                method: "GET",
                redirect: "follow",
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Get Nearby Jobs For Worker API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Nearby jobs for worker response:", data);
        return data;
    } catch (error) {
        console.error("❌ Get nearby jobs for worker error:", error);
        throw error;
    }
};


// ─────────────────────────────────────────────────────────────────────────────
// Types — each key maps to the category name returned by the API
// ─────────────────────────────────────────────────────────────────────────────

export interface ServiceItem {
    _id: string;
    userId: string;
    subcategory?: string;
    [key: string]: any; // allow extra fields per service type
}

// ============================================================================
// UPDATE THIS INTERFACE IN YOUR api.service.ts FILE
// Replace your existing AllUserData interface with this corrected version
// ============================================================================

export interface AllUserData {
    agriculture?:    ServiceItem[];
    automotive?:     ServiceItem[];
    beauty?:         ServiceItem[];
    business?:       ServiceItem[];
    corporate?:      ServiceItem[];   // ✅ was "corporative" — fixed to match backend
    creative?:       ServiceItem[];   // ✅ was "art"         — fixed to match backend
    dailyWage?:      ServiceItem[];
    techDigital?:    ServiceItem[];   // ✅ was "digital"     — fixed to match backend
    education?:      ServiceItem[];
    events?:         ServiceItem[];   // ✅ was "event"       — fixed to match backend
    food?:           ServiceItem[];
    healthcare?:     ServiceItem[];   // ✅ was "hospital"    — fixed to match backend
    hotelTravel?:    ServiceItem[];   // ✅ was "hotel"       — fixed to match backend
    industrialLocal?: ServiceItem[];  // ✅ was "industrial"  — fixed to match backend
    courier?:        ServiceItem[];
    pet?:            ServiceItem[];
    realEstate?:     ServiceItem[];
    shopping?:       ServiceItem[];
    sports?:         ServiceItem[];
    wedding?:        ServiceItem[];

    [key: string]: ServiceItem[] | undefined; // index signature for dynamic access
}

export interface GetAllDataByUserIdResponse {
    success: boolean;
    message?: string;
    data: AllUserData;
}

// ─────────────────────────────────────────────────────────────────────────────
// API Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /getAllDataByUserId/:userId
 * Returns all service listings created by this user, grouped by category.
 */
export const getAllDataByUserId = async (
    userId: string
): Promise<GetAllDataByUserIdResponse> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/getAllDataByUserId/${userId}`,
            {
                method: "GET",
                redirect: "follow",
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("getAllDataByUserId API error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ getAllDataByUserId response:", data);
        return data;
    } catch (error) {
        console.error("❌ getAllDataByUserId error:", error);
        throw error;
    }
};

// ==================== REMOVE WORKER FROM JOB ====================
// POST /removeworker  { workerId, jobId }
export const removeWorker = async (
    workerId: string,
    jobId: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const urlencoded = new URLSearchParams();
        urlencoded.append("workerId", workerId);
        urlencoded.append("jobId", jobId);

        const response = await fetch(`${API_BASE_URL}/removeworker`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: urlencoded,
            redirect: "follow",
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("❌ removeWorker error:", error);
        throw error;
    }
};

// ==================== CONFIRM WORKER FOR JOB ====================
// POST /confirm-job  { jobId, workerId }
export const confirmJob = async (
    jobId: string,
    workerId: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const urlencoded = new URLSearchParams();
        urlencoded.append("jobId", jobId);
        urlencoded.append("workerId", workerId);

        const response = await fetch(`${API_BASE_URL}/confirm-job`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: urlencoded,
            redirect: "follow",
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("❌ confirmJob error:", error);
        throw error;
    }
};

export interface ConfirmedWorkers {
    _id: string;
    userId: string;
    name: string;
    category: string[];
    subCategories: string[];
    skills: string[];
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
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface GetConfirmedWorkersResponse {
    success: boolean;
    message?: string;
    data: ConfirmedWorkers[];  // already flattened by the function below
}

export const getConfirmedWorkers = async (
    jobId: string
): Promise<GetConfirmedWorkersResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/getConfirmedWorkers/${jobId}`, {
            method: "GET",
            redirect: "follow",
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const json = await response.json();

        // ✅ API nests workers inside json.data.confirmedWorkers
        const workers: ConfirmedWorkers[] =
            json?.data?.confirmedWorkers ||
            json?.data ||
            [];

        return {
            success: json.success ?? true,
            message: json.message,
            data: workers,   // ← always a flat array
        };
    } catch (error) {
        console.error("❌ getConfirmedWorkers error:", error);
        throw error;
    }
};
// ==================== CHECK IF WORKER ALREADY APPLIED TO JOB ====================
export const checkJobApplication = async (
    jobId: string,
    workerId: string
): Promise<boolean> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/getConfirmedWorkers/${jobId}`,
            { method: "GET", redirect: "follow" }
        );

        if (!response.ok) return false;

        const json = await response.json();

        // ✅ FIXED: same path fix
        const workers: any[] =
            json?.data?.confirmedWorkers ||
            json?.data ||
            [];

        return workers.some(
            (w) => w._id === workerId || w.userId === workerId
        );
    } catch (error) {
        console.error("❌ checkJobApplication error:", error);
        return false;
    }
};

// ==================== GET CONFIRMED WORKERS COUNT FOR A JOB ====================
export const getConfirmedWorkersCount = async (
    jobId: string
): Promise<number> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/getConfirmedWorkers/${jobId}`,
            { method: "GET", redirect: "follow" }
        );

        if (!response.ok) return 0;

        const json = await response.json();

        // ✅ FIXED: same path fix
        const workers: any[] =
            json?.data?.confirmedWorkers ||
            json?.data ||
            [];

        return workers.length;
    } catch (error) {
        console.error("❌ getConfirmedWorkersCount error:", error);
        return 0;
    }
};