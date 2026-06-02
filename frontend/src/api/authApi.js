import axiosClient from './axiosClient';

const authApi = {
  login: (data) => {
    return axiosClient.post('/auth/login', data);
  },
  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },
  verifyOtp: (data) => {
    return axiosClient.post('/auth/verify-otp', data);
  },
  getCurrentUser: () => {
    return axiosClient.get('/auth/me'); // Optional endpoint if you have it
  },
  updateProfile: (data) => {
    return axiosClient.put('/auth/profile', data);
  },
};

export default authApi;
