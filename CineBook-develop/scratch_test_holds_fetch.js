async function testHolds() {
    try {
        console.log('Logging in...');
        let loginRes = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@cinebook.com',
                password: 'password'
            })
        });
        
        let loginData = await loginRes.json();
        console.log('Login Response:', loginData);
        if (!loginData.success) {
             loginRes = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'customer@cinebook.com',
                    password: 'password'
                })
            });
            loginData = await loginRes.json();
            console.log('Customer Login Response:', loginData);
        }

        const token = loginData.data.token || loginData.data.accessToken;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log('Holding seat 1 for showtime 1');
        let holdRes = await fetch('http://localhost:8080/api/showtimes/1/seats/1/hold', {
            method: 'POST',
            headers: config.headers
        });
        console.log('Hold response status:', holdRes.status);
        console.log(await holdRes.text());

        console.log('Fetching seats for showtime 1');
        let seatsRes = await fetch('http://localhost:8080/api/showtimes/1/seats');
        let seatsData = await seatsRes.json();
        let seat1 = seatsData.data.find(s => s.seatId === 1);
        console.log('Seat 1 status:', seat1.status, 'Held by:', seat1.heldByUserId);

        console.log('Releasing all holds for showtime 1');
        let relRes = await fetch('http://localhost:8080/api/showtimes/1/seats/hold/all', {
            method: 'DELETE',
            headers: config.headers
        });
        console.log('Release response status:', relRes.status);
        console.log(await relRes.text());

        console.log('Fetching seats for showtime 1 again');
        seatsRes = await fetch('http://localhost:8080/api/showtimes/1/seats');
        seatsData = await seatsRes.json();
        seat1 = seatsData.data.find(s => s.seatId === 1);
        console.log('Seat 1 status:', seat1.status, 'Held by:', seat1.heldByUserId);

    } catch (err) {
        console.error(err);
    }
}

testHolds();
