import axios from "axios";

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN')

  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }
  return config;
});

axiosClient.interceptors.request.use((response) => {
  return response
}, (error) => {
  try {
    if (error.response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN')
      localStorage.removeItem('user_info')
      localStorage.removeItem('TYPE_POSITION')
      window.location.href='/signin'
    }
  } catch (error) {
    console.log(error)
  }

  throw error;
});


export default axiosClient;