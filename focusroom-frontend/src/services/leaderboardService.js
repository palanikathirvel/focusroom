import api from './apiService';

export const leaderboardService = {
    getLeaderboard: async () => {
        const response = await api.get('/leaderboard');
        return response.data;
    },

    getUserRank: async (userId) => {
        const response = await api.get(`/leaderboard/user/${userId}`);
        return response.data;
    },

    getTopUsers: async (limit) => {
        const response = await api.get(`/leaderboard/top/${limit}`);
        return response.data;
    },

    getRoomLeaderboard: async (roomId) => {
        const response = await api.get(`/leaderboard/room/${roomId}`);
        return response.data;
    },
};
