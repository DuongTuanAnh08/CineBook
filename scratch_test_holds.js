const axios = require('axios');

async function testHolds() {
    try {
        const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
            email: 'admin@cinebook.com',
            password: 'password'
        });
        const token = loginRes.data.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log('Holding seat 1 for showtime 1');
        await axios.post('http://localhost:8080/api/showtimes/1/seats/1/hold', {}, config);

        console.log('Fetching seats for showtime 1');
        let seatsRes = await axios.get('http://localhost:8080/api/showtimes/1/seats');
        let seat1 = seatsRes.data.data.find(s => s.seatId === 1);
        console.log('Seat 1 status:', seat1.status, 'Held by:', seat1.heldByUserId);

        console.log('Releasing all holds for showtime 1');
        await axios.delete('http://localhost:8080/api/showtimes/1/seats/hold/all', config);

        console.log('Fetching seats for showtime 1 again');
        seatsRes = await axios.get('http://localhost:8080/api/showtimes/1/seats');
        seat1 = seatsRes.data.data.find(s => s.seatId === 1);
        console.log('Seat 1 status:', seat1.status, 'Held by:', seat1.heldByUserId);

    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
    }
}

testHolds();
