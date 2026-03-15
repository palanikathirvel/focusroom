import api from './apiService';

export const userService = {
    getUserById: async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    },

    getUsersByIds: async (userIds) => {
        try {
            const response = await api.post('/users/batch', { userIds });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    getCurrentUser: async (userId) => {
        const response = await api.get(`/users/${userId}/profile`);
        return response.data;
    },

    updateUserProfile: async (userId, data) => {
        const response = await api.put(`/users/${userId}`, data);
        return response.data;
    },

    uploadProfilePhoto: async (userId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/users/${userId}/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
