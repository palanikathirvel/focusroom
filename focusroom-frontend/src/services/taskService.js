import api from './apiService';

export const taskService = {
    createTask: async (taskName, userId) => {
        const response = await api.post('/tasks', { taskName, userId, status: 'PENDING' });
        return response.data;
    },

    getUserTasks: async (userId) => {
        const response = await api.get(`/tasks/user/${userId}`);
        return response.data;
    },

    updateTaskStatus: async (taskId, status) => {
        const response = await api.put(`/tasks/${taskId}/update?status=${status}`);
        return response.data;
    },

    deleteTask: async (taskId) => {
        const response = await api.delete(`/tasks/${taskId}`);
        return response.data;
    },

    getTaskById: async (taskId) => {
        const response = await api.get(`/tasks/${taskId}`);
        return response.data;
    },
};
