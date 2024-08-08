import axios from 'axios';

// Define the base URL for the API
const API_BASE_URL = 'http://localhost:8080';

// Sign in for HR
export const signInHR = async (username, password) => {
    try {
        // Make a POST request to the HR sign-in endpoint
        const response = await axios.post(`${API_BASE_URL}/hr/signIn`, { username, password });
        return response.data; // Return the response data
    } catch (error) {
        // Log and throw an error if the request fails
        console.error('Error signing in HR:', error);
        throw error;
    }
};

// Sign in for Manager
export const signInManager = async (username, password) => {
    try {
        // Make a POST request to the Manager sign-in endpoint
        const response = await axios.post(`${API_BASE_URL}/manager/signIn`, { username, password });
        return response.data; // Return the response data
    } catch (error) {
        // Log and throw an error if the request fails
        console.error('Error signing in Manager:', error);
        throw error;
    }
};

// Sign in for User
export const signInUser = async (username, password) => {
    try {
        // Make a POST request to the User sign-in endpoint
        const response = await axios.post(`${API_BASE_URL}/user/signIn`, { username, password });
        return response.data; // Return the response data
    } catch (error) {
        // Log and throw an error if the request fails
        console.error('Error signing in User:', error);
        throw error;
    }
};
