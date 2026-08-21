import client from './client';

export const getToday = () => client.get('/today');
export const getTeam = () => client.get('/team');
export const createTeamMember = (payload) => client.post('/team', payload);

export const listIdeas = () => client.get('/ideas');
export const createIdea = (title) => client.post('/ideas', { title });

export const listContent = (params) => client.get('/content', { params });
export const getContent = (id) => client.get(`/content/${id}`);
export const createContent = (payload) => client.post('/content', payload);
export const publishContent = (id) => client.patch(`/content/${id}/publish`);

export const completeTask = (taskId) => client.post(`/tasks/${taskId}/complete`);
