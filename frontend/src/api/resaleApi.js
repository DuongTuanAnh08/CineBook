import axiosClient from './axiosClient';

const resaleApi = {
    getAllListings: () => {
        return axiosClient.get('/resale');
    },
    
    getAllListingsAdmin: () => {
        return axiosClient.get('/resale/admin');
    },

    createListing: (data) => {
        return axiosClient.post('/resale', data);
    },

    hideListing: (id, adminId, reason) => {
        return axiosClient.put(`/resale/${id}/hide`, null, {
            params: { adminId, reason }
        });
    },

    unhideListing: (id, adminId) => {
        return axiosClient.put(`/resale/${id}/unhide`, null, {
            params: { adminId }
        });
    },

    getMyListings: (sellerId) => {
        return axiosClient.get('/resale/my-listings', { params: { sellerId } });
    },

    updateListing: (id, sellerId, askingPrice, note) => {
        return axiosClient.put(`/resale/${id}`, null, {
            params: { sellerId, askingPrice, note }
        });
    },

    deleteListing: (id, sellerId) => {
        return axiosClient.delete(`/resale/${id}`, {
            params: { sellerId }
        });
    }
};

export default resaleApi;
