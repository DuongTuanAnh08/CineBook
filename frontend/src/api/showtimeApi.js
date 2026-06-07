import axiosClient from './axiosClient';

const showtimeApi = {
    getAllShowtimes: (params) => {
        return axiosClient.get('/showtimes', { params });
    },
    
    getShowtimeById: (id) => {
        return axiosClient.get(`/showtimes/${id}`);
    },

    getSeats: (id) => {
        return axiosClient.get(`/showtimes/${id}/seats`);
    },

    createShowtime: (data) => {
        return axiosClient.post('/showtimes', data);
    }
};

export default showtimeApi;
