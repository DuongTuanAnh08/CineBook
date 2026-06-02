import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class CreateManager {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/cinebook_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Ho_Chi_Minh";
        String user = "root";
        String password = System.getenv("DB_PASSWORD");
        
        String sql = "INSERT INTO Users (full_name, email, password_hash, phone, role, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
                     
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
             
            // Using the same bcrypt hash for "123456" as in V2__seed_data.sql
            String bcryptHash123456 = "$2a$12$ye3x31aAjUsR7av6gdvts.C.wpUokdeGmnIrA8JlB1JzwKICNOwOO";
            
            pstmt.setString(1, "Schedule Manager");
            pstmt.setString(2, "manager@cinebook.vn");
            pstmt.setString(3, bcryptHash123456);
            pstmt.setString(4, "0999999999");
            pstmt.setString(5, "ScheduleManager"); // Maps to UserRole.ScheduleManager
            pstmt.setString(6, "Active");
            
            int rowsAffected = pstmt.executeUpdate();
            System.out.println("Success! Inserted " + rowsAffected + " row(s).");
            System.out.println("Email: manager@cinebook.vn");
            System.out.println("Password: 123456");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
