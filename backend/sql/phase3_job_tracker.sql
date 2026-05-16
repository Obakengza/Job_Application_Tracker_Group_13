-- =====================================================
-- PHASE 3: JOB APPLICATION TRACKER DATABASE
-- Raw SQL using PostgreSQL
-- Backend duty: Users, Authentication and Profile support
-- =====================================================

-- =========================
-- 1. DROP OLD OBJECTS
-- =========================

DROP VIEW IF EXISTS view_user_applications;

DROP TABLE IF EXISTS reminder;
DROP TABLE IF EXISTS interview;
DROP TABLE IF EXISTS job_application;
DROP TABLE IF EXISTS application_status;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;


-- =========================
-- 2. DATABASE TABLES
-- =========================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    location VARCHAR(100)
);

CREATE TABLE application_status (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE job_application (
    application_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    company_id INT NOT NULL,
    status_id INT NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    application_date DATE NOT NULL,
    salary DECIMAL(10,2),

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_company
        FOREIGN KEY(company_id)
        REFERENCES companies(company_id),

    CONSTRAINT fk_status
        FOREIGN KEY(status_id)
        REFERENCES application_status(status_id),

    CONSTRAINT chk_salary
        CHECK (salary >= 0)
);

CREATE TABLE interview (
    interview_id SERIAL PRIMARY KEY,
    application_id INT NOT NULL,
    interview_date DATE,
    interview_type VARCHAR(50),

    CONSTRAINT fk_application
        FOREIGN KEY(application_id)
        REFERENCES job_application(application_id)
);

CREATE TABLE reminder (
    reminder_id SERIAL PRIMARY KEY,
    application_id INT NOT NULL,
    reminder_date DATE NOT NULL,
    message TEXT,

    CONSTRAINT fk_reminder_application
        FOREIGN KEY(application_id)
        REFERENCES job_application(application_id)
);


-- =========================
-- 3. INSERT DATA
-- =========================

INSERT INTO application_status (status_name)
VALUES
('Pending'),
('Interview'),
('Accepted'),
('Rejected');

INSERT INTO users (full_name, email, password, phone_number)
VALUES
('Blessed Maake', 'blessed@gmail.com', 'pass123', '0712345678'),
('John Smith', 'john@gmail.com', 'pass456', '0723456789'),
('Mary Johnson', 'mary@gmail.com', 'pass789', '0734567890'),
('Thabo Mokoena', 'thabo@gmail.com', 'pass321', '0745678901');

INSERT INTO companies (company_name, industry, location)
VALUES
('Google', 'Technology', 'Johannesburg'),
('Microsoft', 'Technology', 'Cape Town'),
('FNB', 'Banking', 'Sandton'),
('Vodacom', 'Telecommunications', 'Midrand');

INSERT INTO job_application
(user_id, company_id, status_id, job_title, application_date, salary)
VALUES
(1, 1, 1, 'Backend Developer', '2026-05-15', 35000.00),
(1, 2, 2, 'Junior Software Developer', '2026-05-16', 28000.00),
(2, 3, 3, 'Data Analyst', '2026-05-14', 30000.00),
(3, 4, 4, 'Systems Analyst', '2026-05-10', 32000.00),
(4, 1, 1, 'Database Administrator', '2026-05-18', 40000.00);

INSERT INTO interview
(application_id, interview_date, interview_type)
VALUES
(1, '2026-05-20', 'Technical'),
(2, '2026-05-22', 'HR'),
(3, '2026-05-25', 'Final');

INSERT INTO reminder
(application_id, reminder_date, message)
VALUES
(1, '2026-05-18', 'Prepare for technical interview'),
(2, '2026-05-19', 'Submit required documents'),
(3, '2026-05-21', 'Follow up on application');


-- =========================
-- 4. INDEXES
-- =========================

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_job_application_user
ON job_application(user_id);

CREATE INDEX idx_job_application_status
ON job_application(status_id);

CREATE INDEX idx_company_name
ON companies(company_name);


-- =========================
-- 5. VIEW
-- =========================

CREATE VIEW view_user_applications AS
SELECT 
    users.full_name,
    users.email,
    companies.company_name,
    companies.industry,
    job_application.job_title,
    application_status.status_name,
    job_application.application_date,
    job_application.salary
FROM job_application
JOIN users 
    ON job_application.user_id = users.user_id
JOIN companies 
    ON job_application.company_id = companies.company_id
JOIN application_status 
    ON job_application.status_id = application_status.status_id;


-- =========================
-- 6. QUERIES
-- =========================

-- Query 1: Display all users
SELECT * FROM users;

-- Query 2: Display all job applications
SELECT * FROM job_application;

-- Query 3: Query limitation using selected columns
SELECT full_name, email
FROM users;

-- Query 4: Sorting operation
SELECT job_title, salary
FROM job_application
ORDER BY salary DESC;

-- Query 5: LIKE operator
SELECT *
FROM users
WHERE full_name LIKE 'B%';

-- Query 6: AND operator
SELECT *
FROM job_application
WHERE salary > 30000
AND status_id = 1;

-- Query 7: OR operator
SELECT *
FROM application_status
WHERE status_name = 'Accepted'
OR status_name = 'Rejected';

-- Query 8: Character function
SELECT UPPER(full_name) AS uppercase_name
FROM users;

-- Query 9: Date function
SELECT job_title, application_date, CURRENT_DATE AS today
FROM job_application;

-- Query 10: Rounding
SELECT ROUND(AVG(salary), 2) AS average_salary
FROM job_application;

-- Query 11: Aggregate function
SELECT COUNT(*) AS total_applications
FROM job_application;

-- Query 12: GROUP BY
SELECT status_id, COUNT(*) AS total_applications
FROM job_application
GROUP BY status_id;

-- Query 13: GROUP BY with HAVING
SELECT status_id, COUNT(*) AS total_applications
FROM job_application
GROUP BY status_id
HAVING COUNT(*) >= 1;

-- Query 14: JOIN query
SELECT 
    users.full_name,
    companies.company_name,
    job_application.job_title,
    application_status.status_name
FROM job_application
JOIN users
    ON job_application.user_id = users.user_id
JOIN companies
    ON job_application.company_id = companies.company_id
JOIN application_status
    ON job_application.status_id = application_status.status_id;

-- Query 15: Subquery
SELECT full_name
FROM users
WHERE user_id IN (
    SELECT user_id
    FROM job_application
    WHERE salary > 30000
);

-- Query 16: View query
SELECT * FROM view_user_applications;