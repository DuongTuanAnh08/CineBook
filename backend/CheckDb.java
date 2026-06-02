import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckDb {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/cinebook_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Ho_Chi_Minh";
        String user = "root";
        String password = System.getenv("DB_PASSWORD");
        
        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT id, email, role FROM Users WHERE id = 1")) {
             
            if (rs.next()) {
                System.out.println("ID: " + rs.getLong("id"));
                System.out.println("Email: " + rs.getString("email"));
                System.out.println("Role: " + rs.getString("role"));
            } else {
                System.out.println("User not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
