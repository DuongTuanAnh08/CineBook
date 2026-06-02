import axiosClient from './axiosClient';

const roomApi = {
  getRooms: (params) => {
    return axiosClient.get('/rooms', { params });
  },
  getRoomById: (id) => {
    return axiosClient.get(`/rooms/${id}`);
  },
  getRoomSeats: (id) => {
    return axiosClient.get(`/rooms/${id}/seats`);
  },
  configureSeats: (id, seatConfigs) => {
    return axiosClient.post(`/rooms/${id}/seats`, seatConfigs);
  },
  createRoom: (data) => {
    return axiosClient.post('/rooms', data);
  }
};

export default roomApi;
