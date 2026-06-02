import axiosClient from './axiosClient';

const roomApi = {
  getRooms: (params) => {
    return axiosClient.get('/rooms', { params });
  },
  getRoomById: (id) => {
    return axiosClient.get(`/rooms/${id}`);
  },
  createRoom: (data) => {
    return axiosClient.post('/rooms', data);
  }
};

export default roomApi;
