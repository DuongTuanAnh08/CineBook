import axiosClient from './axiosClient';

const reviewApi = {
    getMovieReviews(movieId) {
        return axiosClient.get(`/reviews/movie/${movieId}`);
    },
    createReview(data) {
        return axiosClient.post('/reviews', data);
    },
    getReviewByBookingId(bookingId) {
        return axiosClient.get(`/reviews/booking/${bookingId}`);
    }
};

export default reviewApi;
