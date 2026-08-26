import api from './axios';

export const fetchNotes = (params = {}) => api.get('/notes', { params });
export const fetchNoteById = (id) => api.get(`/notes/${id}`);
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const summarizeNote = (id) => api.post(`/notes/${id}/summarize`);
export const togglePin = (id) => api.patch(`/notes/${id}/pin`);