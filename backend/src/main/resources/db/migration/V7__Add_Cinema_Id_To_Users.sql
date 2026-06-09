-- Add cinema_id column to Users table
ALTER TABLE Users
ADD COLUMN cinema_id BIGINT UNSIGNED NULL,
ADD CONSTRAINT fk_users_cinema FOREIGN KEY (cinema_id) REFERENCES Cinemas(cinema_id) ON DELETE SET NULL;
