import api from './apiService';

export const chatService = {
    getChatHistory: async (roomId) => {
        try {
            const response = await api.get(`/chat/${roomId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching chat history:', error);
            return [];
        }
    },

    sendMessage: async (roomId, userId, userName, message) => {
        try {
            const response = await api.post('/chat/send', {
                roomId,
                userId,
                userName,
                message
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    deleteMessage: async (messageId) => {
        try {
            const response = await api.delete(`/chat/${messageId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    },
};
