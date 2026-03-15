import api from './apiService';

export const sessionService = {
    startSession: async (roomId) => {
        const response = await api.post('/session/start', { roomId });
        return response.data;
    },

    endSession: async (sessionId) => {
        const response = await api.post(`/session/${sessionId}/end`);
        return response.data;
    },

    pauseSession: async (sessionId) => {
        const response = await api.post(`/session/${sessionId}/pause`);
        return response.data;
    },

    resumeSession: async (sessionId) => {
        const response = await api.post(`/session/${sessionId}/resume`);
        return response.data;
    },

    getActiveSession: async (userId) => {
        try {
            const response = await api.get(`/session/user/${userId}/active`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    getSessionHistory: async (userId) => {
        const response = await api.get(`/session/user/${userId}/history`);
        return response.data;
    },

    getRoomActiveSessions: async (roomId) => {
        const response = await api.get(`/session/room/${roomId}/active`);
        return response.data;
    },
};
