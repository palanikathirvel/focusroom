import api from './apiService';

export const authService = {
    register: async (name, email, password) => {
        console.log('authService.register called with:', { name, email });
        try {
            const response = await api.post('/auth/register', { name, email, password });
            console.log('Registration response:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('name', response.data.name);
                if (response.data.profileImageUrl) {
                    localStorage.setItem('profileImageUrl', response.data.profileImageUrl);
                }
                console.log('User data saved to localStorage');
            }

            return response.data;
        } catch (error) {
            console.error('API call failed:', error.message);
            console.error('Error response:', error.response);
            throw error;
        }
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('name', response.data.name);
            if (response.data.profileImageUrl) {
                localStorage.setItem('profileImageUrl', response.data.profileImageUrl);
            }
        }

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('profileImageUrl');
    },

    updateProfileImage: (imageUrl) => {
        localStorage.setItem('profileImageUrl', imageUrl);
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    getCurrentUser: () => {
        return {
            userId: localStorage.getItem('userId'),
            email: localStorage.getItem('email'),
            name: localStorage.getItem('name'),
            profileImageUrl: localStorage.getItem('profileImageUrl'),
        };
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};
