-- Create schools table
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    current_semester VARCHAR(50),
    semester_start DATE,
    semester_end DATE,
    canvas_url VARCHAR(255)
);

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    access_token VARCHAR(255),
    refresh_token VARCHAR(255),
    canvas_token VARCHAR(255),
    role VARCHAR(50)
);

CREATE TABLE canvas_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255),
    school_id INT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (school_id) REFERENCES schools(id)
);

-- Create classes table
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    semester VARCHAR(50),
    school_id INT,
    canvas_id VARCHAR(255),
    FOREIGN KEY (school_id) REFERENCES schools(id)
);

-- Create events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100),
    event_title VARCHAR(255),
    event_description VARCHAR(255),
    user_id INT,
    start_time DATETIME,
    end_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create users_class table (many-to-many relationship)
CREATE TABLE users_class (
    user_id INT,
    class_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    PRIMARY KEY (user_id, class_id)
);

-- Create users_school table (many-to-many relationship)
CREATE TABLE users_school (
    user_id INT,
    school_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(id),
    PRIMARY KEY (user_id, school_id)
);

-- Insert test data for schools
INSERT INTO schools (name, current_semester, semester_start, semester_end, canvas_url)
VALUES ('CSUSM', 'Fall 2023', '2023-08-28', '2023-12-15','https://csusm.instructure.com/api/graphql');

-- Insert test data for users
INSERT INTO users (first_name, last_name, access_token, refresh_token, canvas_token)
VALUES ('John', 'Doe', 'access_token_123', 'refresh_token_123', 'canvas_token_123');

-- Insert test data for classes
INSERT INTO classes (name, semester, school_id)
VALUES ('CS 370', 'Fall 2023', 1);

-- Insert test data for events
INSERT INTO events (event_type, user_id, start_time, end_time)
VALUES ('Meeting', 1, '2023-09-15 10:00:00', '2023-09-15 11:00:00');

-- Insert test data for users_class (many-to-many relationship)
INSERT INTO users_class (user_id, class_id)
VALUES (1, 1);

-- Insert test data for users_class (many-to-many relationship)
INSERT INTO users_school (user_id, school_id)
VALUES (1, 1);
