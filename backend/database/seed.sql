INSERT INTO users
(first_name, last_name, email, password, phone, address, province, country, role)
VALUES
('John', 'Doe', 'john@gmail.com', 'pass123', '0711111111', '12 Main Road', 'Gauteng', 'South Africa', 'user'),
('Sarah', 'Smith', 'sarah@gmail.com', 'pass123', '0722222222', '45 River Street', 'Limpopo', 'South Africa', 'user'),
('Michael', 'Brown', 'michael@gmail.com', 'pass123', '0733333333', '89 Loop Road', 'Western Cape', 'South Africa', 'admin');

INSERT INTO application_status
(status_name, description)
VALUES
('Applied', 'Application submitted'),
('Interview', 'Interview scheduled'),
('Accepted', 'Application accepted'),
('Rejected', 'Application rejected');

INSERT INTO company
(company_name, location, website, industry)
VALUES
('Google', 'California', 'https://google.com', 'Technology'),
('Microsoft', 'Washington', 'https://microsoft.com', 'Technology'),
('Amazon', 'Seattle', 'https://amazon.com', 'E-commerce'),
('Nedbank', 'Cape Town', 'https://www.nedbank.co.za', 'Finance'),
('Discovery', 'Johannesburg', 'https://www.discovery.co.za', 'Insurance');

INSERT INTO job_post
(
    admin_id,
    company_id,
    job_title,
    job_description,
    industry,
    salary,
    employment_type,
    work_mode,
    experience_level,
    post_date,
    deadline_date,
    is_active
)
VALUES
(3, 1, 'Software Developer', 'Develop web applications', 'Technology', 45000, 'Full-time', 'Hybrid', 'Entry', '2026-05-17', '2026-12-31', TRUE),
(3, 2, 'Data Analyst', 'Analyze company data', 'Technology', 40000, 'Full-time', 'Remote', 'Mid', '2026-05-17', '2026-11-30', TRUE),
(3, 4, 'Finance Intern', 'Assist with finance reporting', 'Finance', 8000, 'Internship', 'Onsite', 'Entry', '2026-05-17', '2026-06-30', TRUE),
(3, 5, 'Customer Support Agent', 'Support clients with application queries', 'Customer Service', 12000, 'Part-time', 'Remote', 'Entry', '2026-05-17', '2026-07-10', TRUE);

INSERT INTO job_application
(
    user_id,
    company_id,
    job_post_id,
    status_id,
    job_title,
    application_date,
    employment_type,
    work_mode,
    expected_salary,
    notes
)
VALUES
(1, 1, 1, 1, 'Software Developer', '2026-05-18', 'Full-time', 'Hybrid', 50000, 'Strong interest in backend development'),
(2, 2, 2, 2, 'Data Analyst', '2026-05-19', 'Full-time', 'Remote', 42000, 'Remote work preferred'),
(1, 4, 3, 1, 'Finance Intern', '2026-05-20', 'Internship', 'Onsite', 9000, 'Available immediately');

INSERT INTO interview
(
    application_id,
    interview_date,
    interview_type,
    interviewer_name,
    note
)
VALUES
(2, '2026-06-01 10:00:00', 'Technical', 'Mr Johnson', 'Bring portfolio');

INSERT INTO reminder
(
    application_id,
    reminder_date,
    message
)
VALUES
(1, '2026-05-25', 'Follow up with recruiter'),
(2, '2026-05-28', 'Prepare for technical interview');
