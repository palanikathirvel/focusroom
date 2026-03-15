import api from './apiService';

export const roomService = {
    getAllRooms: async () => {
        const response = await api.get('/rooms');
        return response.data;
    },

    getRoomById: async (roomId) => {
        const response = await api.get(`/rooms/${roomId}`);
        return response.data;
    },

    createRoom: async (roomName, maxMembers = 10, focusDuration = 25, breakDuration = 5) => {
        const response = await api.post('/rooms/create', { roomName, maxMembers, focusDuration, breakDuration });
        return response.data;
    },

    joinRoom: async (roomId) => {
        const response = await api.post(`/rooms/${roomId}/join`);
        return response.data;
    },

    leaveRoom: async (roomId) => {
        const response = await api.delete(`/rooms/${roomId}/leave`);
        return response.data;
    },

    deleteRoom: async (roomId) => {
        const response = await api.delete(`/rooms/${roomId}`);
        return response.data;
    },

    checkMember: async (roomId) => {
        const response = await api.get(`/rooms/${roomId}/check-member`);
        return response.data;
    },

    getRoomMembers: async (roomId) => {
        const response = await api.get(`/rooms/${roomId}/members`);
        return response.data;
    },
};
