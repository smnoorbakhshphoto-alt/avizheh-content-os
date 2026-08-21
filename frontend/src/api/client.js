import axios from 'axios';

const client = axios.create({ baseURL: '/api', timeout: 20000 });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('contentos_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const body = err.response?.data;
    if (err.response?.status === 401) {
      localStorage.removeItem('contentos_token');
      localStorage.removeItem('contentos_member');
      if (!window.location.pathname.startsWith('/login')) window.location.href = '/login';
    }
    return Promise.reject({
      status: err.response?.status,
      message: body?.error?.message || 'خطایی رخ داد. دوباره تلاش کنید.',
      code: body?.error?.code,
    });
  }
);

export default client;
