import api from './apiService';

export const noteService = {
  uploadNote: async (roomId, file, userId, userName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userName', userName);

    const response = await api.post(`/rooms/${roomId}/notes/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-User-Id': userId
      }
    });
    return response.data;
  },

  getRoomNotes: async (roomId) => {
    const response = await api.get(`/rooms/${roomId}/notes`);
    return response.data;
  }
};
