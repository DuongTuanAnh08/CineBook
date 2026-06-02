const fs = require('fs');

const collection = {
  info: {
    name: "CineBook API Full Collection",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    { key: "base_url", value: "http://localhost:8080/api", type: "string" },
    { key: "token", value: "", type: "string" }
  ],
  item: []
};

function createRequest(name, method, path, body = null, auth = true) {
  const req = {
    name: name,
    request: {
      method: method,
      header: [
        { key: "Content-Type", value: "application/json" }
      ],
      url: {
        raw: "{{base_url}}" + path,
        host: ["{{base_url}}"],
        path: path.split('/').filter(p => p)
      }
    }
  };
  
  if (auth) {
    req.request.auth = {
      type: "bearer",
      bearer: [{ key: "token", value: "{{token}}", type: "string" }]
    };
  }
  
  if (body) {
    req.request.body = {
      mode: "raw",
      raw: JSON.stringify(body, null, 2),
      options: { raw: { language: "json" } }
    };
  }
  
  return req;
}

collection.item.push({
  name: "1. Auth",
  item: [
    createRequest("1.1 Register", "POST", "/auth/register", { email: "admin@cinebook.vn", password: "123456", fullName: "Customer", phone: "0987654321" }, false),
    createRequest("1.2 Verify OTP", "POST", "/auth/verify-otp", { email: "customer@gmail.com", otp: "123456" }, false),
    createRequest("1.3 Login", "POST", "/auth/login", { email: "admin@cinebook.vn", password: "123456" }, false),
    createRequest("1.4 Refresh Token", "POST", "/auth/refresh", { refreshToken: "your_refresh_token_here" }, false),
    createRequest("1.5 Forgot Password", "POST", "/auth/forgot-password", { email: "customer@gmail.com" }, false),
    createRequest("1.6 Change Password", "POST", "/auth/change-password", { oldPassword: "old", newPassword: "new" }, true),
    createRequest("1.7 Logout", "POST", "/auth/logout", { refreshToken: "your_refresh_token_here" }, true)
  ]
});

collection.item.push({
  name: "2. Public Data (Movies, Cinemas, Showtimes)",
  item: [
    createRequest("2.1 Get All Movies", "GET", "/movies?page=0&size=20", null, false),
    createRequest("2.2 Get Movie Details", "GET", "/movies/1", null, false),
    createRequest("2.3 Get All Cinemas", "GET", "/cinemas", null, false),
    createRequest("2.4 Get Cinema Details", "GET", "/cinemas/1", null, false),
    createRequest("2.5 Get All Showtimes", "GET", "/showtimes", null, false),
    createRequest("2.6 Get All News", "GET", "/news", null, false),
    createRequest("2.7 Get All F&B Products", "GET", "/fnb", null, false),
    createRequest("2.8 Validate Promo", "GET", "/promos/validate?code=WELCOME10&bookingTotal=150000", null, false)
  ]
});

collection.item.push({
  name: "3. Customer Actions",
  item: [
    createRequest("3.1 Create Booking", "POST", "/bookings", { customerId: 2, showtimeId: 1, seatIds: [1, 2] }, true),
    createRequest("3.2 Create VNPay URL", "POST", "/payments/create-url?bookingId=1", null, true),
    createRequest("3.3 Create Review", "POST", "/reviews", { movieId: 1, userId: 2, rating: 5, comment: "Phim quá hay!" }, true),
    createRequest("3.4 Create Resale Listing", "POST", "/resale", { bookingId: 1, sellerId: 2, price: 100000 }, true)
  ]
});

collection.item.push({
  name: "4. Admin & Manager Actions",
  item: [
    createRequest("4.1 Create Movie", "POST", "/movies", { title: "New Movie", durationMin: 120, releaseDate: "2026-07-01", synopsis: "Desc", trailerUrl: "url", posterUrl: "url", ageRating: "PG-13", language: "English", director: "John Doe", genreIds: [1] }, true),
    createRequest("4.2 Update Movie", "PUT", "/movies/1", { title: "Updated Movie" }, true),
    createRequest("4.3 Delete Movie", "DELETE", "/movies/1", null, true),
    createRequest("4.4 Create Cinema", "POST", "/cinemas", { name: "CineBook Q2", location: "District 2" }, true),
    createRequest("4.5 Create Room", "POST", "/rooms", { cinemaId: 1, name: "Room 3", roomType: "STANDARD", rowsCount: 10, columnsCount: 10 }, true),
    createRequest("4.6 Create Showtime", "POST", "/showtimes", { movieId: 1, roomId: 1, startTime: "2026-06-02T10:00:00", endTime: "2026-06-02T12:00:00" }, true),
    createRequest("4.7 Create F&B Product", "POST", "/fnb", { name: "Popcorn L", type: "FOOD", price: 55000, description: "Large popcorn" }, true),
    createRequest("4.8 Hide Resale Listing", "PUT", "/resale/1/hide?adminId=1&reason=Violation", null, true),
    createRequest("4.9 Get Dashboard KPI", "GET", "/dashboard/kpi", null, true),
    createRequest("4.10 Get System Config", "GET", "/config", null, true),
    createRequest("4.11 Update Config", "PUT", "/config/maintenance_mode", { configValue: "true" }, true)
  ]
});

fs.writeFileSync("CineBook_Postman_Collection.json", JSON.stringify(collection, null, 2));
console.log("Postman collection generated successfully.");
