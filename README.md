# 🎬 CineBook - Nền tảng đặt vé xem phim trực tuyến

CineBook là một hệ thống ứng dụng web chuyên nghiệp dùng để quản lý hệ thống rạp chiếu phim và đặt vé xem phim trực tuyến. Ứng dụng cung cấp trải nghiệm mượt mà cho cả Khách hàng (người xem phim) và Quản trị viên (Ban quản lý rạp).

## ✨ Tính năng nổi bật

### 👑 Dành cho Quản trị viên (Admin Dashboard)
- **Quản lý Phim (Movies):** Thêm mới, chỉnh sửa, cập nhật trạng thái phim (Đang chiếu, Sắp chiếu).
- **Quản lý Lịch chiếu (Showtimes):** Lên lịch chiếu cho từng phim tại từng rạp cụ thể.
- **Quản lý Rạp & Phòng chiếu (Cinemas & Rooms):** Thiết lập thông tin hệ thống rạp, cấu hình ghế ngồi trong từng phòng chiếu.
- **Quản lý Đặt vé (Bookings):** Theo dõi trạng thái đặt vé, lịch sử giao dịch.
- **Quản lý Khuyến mãi (Promotions):** Tạo các chương trình ưu đãi, voucher giảm giá.
- **Quản lý Khách hàng (Customers):** Quản lý thông tin tài khoản, lịch sử mua hàng của người dùng.
- **Thống kê & Báo cáo (Analytics):** Thống kê doanh thu, tỷ lệ lấp đầy phòng chiếu, xu hướng xem phim.
- **Cấu hình hệ thống (Settings):** Tuỳ chỉnh các thông số chung của hệ thống.

### 🍿 Dành cho Khách hàng (Customer Flow)
- **Tài khoản & Xác thực:** Đăng ký an toàn với xác thực OTP, đăng nhập, hỗ trợ Mock-user để test trải nghiệm.
- **Khám phá & Tìm kiếm:** Thanh tìm kiếm đa năng trên Navbar, lọc danh sách phim "Đang chiếu" (Now Showing), "Sắp chiếu" (Coming Soon).
- **Thông tin Khuyến mãi & Rạp:** Tìm kiếm các rạp chiếu phim trong hệ thống và theo dõi các chương trình ưu đãi.
- **Quy trình Đặt vé Trực quan:**
  1. Chọn phim và khung giờ chiếu phù hợp.
  2. Lựa chọn chỗ ngồi trên sơ đồ phòng chiếu trực quan.
  3. Thanh toán đơn giản.
  4. Xác nhận vé điện tử (Ticket confirmation).
- **Trang cá nhân:** Quản lý thông tin tài khoản (Profile), theo dõi và kiểm tra lịch sử vé đã đặt (My Tickets).

## 🚀 Công nghệ sử dụng
Dự án được xây dựng với cấu trúc hiện đại, tập trung vào trải nghiệm người dùng (UX) và hiệu năng. *(Tech stack chi tiết có trong package.json)*

## 📦 Hướng dẫn cài đặt (Local Development)

1. Clone dự án về máy:
   ```bash
   git clone https://github.com/DuongTuanAnh08/CineBook.git
   ```
2. Cài đặt các gói thư viện (dependencies):
   ```bash
   npm install
   # hoặc yarn install
   ```
3. Chạy ứng dụng trong môi trường phát triển (Development):
   ```bash
   npm run dev
   # hoặc yarn dev
   ```

---
*Dự án CineBook được xây dựng nhằm mang lại nền tảng quản lý và trải nghiệm đặt vé xem phim tối ưu nhất.*