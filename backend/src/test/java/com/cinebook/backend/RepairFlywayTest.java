package com.cinebook.backend;
import org.junit.jupiter.api.Test;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
public class RepairFlywayTest {
    @Test
    public void repair() throws Exception {
        try (Connection c = DriverManager.getConnection("jdbc:mysql://localhost:3306/cinebook_db", "root", "123456");
             Statement s = c.createStatement()) {
            s.execute("DELETE FROM flyway_schema_history WHERE version = '2'");
            System.out.println("FLYWAY REPAIRED SUCCESSFULLY");
        }
    }
}
