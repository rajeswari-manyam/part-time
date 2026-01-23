// src/services/automotiveApi.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://13.204.29.0:3001';

export interface AutomotiveService {
    _id: string;
    userId: string;
    name: string;
    businessType: string;
    email: string;
    phone: string;
    services: string[];
    experience: number;
    availability: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    priceRange: string;
    description: string;
    status: boolean;
    images: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface AutomotiveResponse {
    success: boolean;
    count: number;
    data: AutomotiveService[];
}

export interface CreateAutomotiveData {
    userId: string;
    name: string;
    businessType: string;
    phone: string;
    email: string;
    services: string[];
    experience: string;
    availability: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude: string;
    longitude: string;
    priceRange: string;
    description: string;
    images: File[];
}

// Get all automotive services
export const getAllAutomotive = async (): Promise<AutomotiveResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/getAllAutomotive`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`Failed to fetch automotive services: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Result:', result);
        return result;
    } catch (error) {
        console.error('Error fetching automotive services:', error);
        throw error;
    }
};

// Get automotive services by subcategory
export const getAutomotiveBySubcategory = async (subcategory: string): Promise<AutomotiveResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/getAutomotiveBySubcategory/${subcategory}`, {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch automotive services by subcategory');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching automotive services by subcategory:', error);
        throw error;
    }
};

// Create automotive service
export const createAutomotive = async (data: CreateAutomotiveData): Promise<any> => {
    try {
        const formData = new FormData();

        formData.append('userId', data.userId);
        formData.append('name', data.name);
        formData.append('businessType', data.businessType);
        formData.append('phone', data.phone);
        formData.append('email', data.email);

        data.services.forEach(service => {
            formData.append('services', service);
        });

        formData.append('experience', data.experience);
        formData.append('availability', data.availability);
        formData.append('area', data.area);
        formData.append('city', data.city);
        formData.append('state', data.state);
        formData.append('pincode', data.pincode);
        formData.append('latitude', data.latitude);
        formData.append('longitude', data.longitude);
        formData.append('priceRange', data.priceRange);
        formData.append('description', data.description);

        data.images.forEach(image => {
            formData.append('images', image);
        });

        const response = await fetch(`${API_BASE_URL}/automotiveCreate`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to create automotive service');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating automotive service:', error);
        throw error;
    }
};
// Get automotive service by ID
export const getAutomotiveById = async (id: string): Promise<{ success: boolean; data: AutomotiveService }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/getAutomotiveById/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch automotive details");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching automotive by id:", error);
        throw error;
    }
};
// Update automotive service
export const updateAutomotive = async (
    id: string,
    data: CreateAutomotiveData
): Promise<any> => {
    try {
        const formData = new FormData();

        formData.append('userId', data.userId);
        formData.append('name', data.name);
        formData.append('businessType', data.businessType);
        formData.append('phone', data.phone);
        formData.append('email', data.email);

        data.services.forEach(service => {
            formData.append('services', service);
        });

        formData.append('experience', data.experience);
        formData.append('availability', data.availability);
        formData.append('area', data.area);
        formData.append('city', data.city);
        formData.append('state', data.state);
        formData.append('pincode', data.pincode);
        formData.append('latitude', data.latitude);
        formData.append('longitude', data.longitude);
        formData.append('priceRange', data.priceRange);
        formData.append('description', data.description);

        data.images.forEach(image => {
            formData.append('images', image);
        });

        const response = await fetch(`${API_BASE_URL}/updateAutomotive/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update API Error:', errorText);
            throw new Error('Failed to update automotive service');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating automotive service:', error);
        throw error;
    }
};
// Delete automotive service by ID
export const deleteAutomotive = async (id: string): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/deleteAutomotive/${id}`, {
            method: "DELETE",
            redirect: "follow",
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Delete API Error:", errorText);
            throw new Error("Failed to delete automotive service");
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting automotive service:", error);
        throw error;
    }
};
