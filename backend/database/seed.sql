INSERT INTO application_status(status_name, description)
VALUES
('Applied', 'Application submitted'),
('Interview', 'Interview scheduled'),
('Offer', 'Offer received'),
('Rejected', 'Application rejected');

INSERT INTO users
(first_name, last_name, email, password, phone, province, country, role)
VALUES
('John', 'Doe', 'john@gmail.com', 'pass123', '0711111111', 'Gauteng', 'South Africa', 'user'),

('Sarah', 'Smith', 'sarah@gmail.com', 'pass123', '0722222222', 'Limpopo', 'South Africa', 'user'),

('Michael', 'Brown', 'michael@gmail.com', 'pass123', '0733333333', 'Western Cape', 'South Africa', 'admin');

INSERT INTO company
(company_name, location, website, industry)
VALUES
('Google', 'California', 'https://google.com', 'Technology'),

('Microsoft', 'Washington', 'https://microsoft.com', 'Technology'),

('Amazon', 'Seattle', 'https://amazon.com', 'E-commerce');

INSERT INTO job_post
(
company_id,
job_title,
job_description,
industry,
salary,
employment_type,
work_mode,
experience_level,
deadline_date
)
VALUES
(
1,
'Software Developer',
'Develop web applications',
'Technology',
45000,
'Full-time',
'Hybrid',
'Entry',
'2026-12-31'
),

(
2,
'Data Analyst',
'Analyze company data',
'Technology',
40000,
'Full-time',
'Remote',
'Mid',
'2026-11-30'
);

INSERT INTO job_application
(
user_id,
job_post_id,
status_id,
expected_salary,
notes
)
VALUES
(
1,
1,
1,
50000,
'Strong interest in backend development'
),

(
2,
2,
2,
42000,
'Remote work preferred'
);

INSERT INTO interview
(
application_id,
interview_date,
interview_type,
interviewer_name,
notes
)
VALUES
(
2,
'2026-06-01 10:00:00',
'Technical',
'Mr Johnson',
'Bring portfolio'
);

INSERT INTO reminder
(
application_id,
reminder_date,
message
)
VALUES
(
1,
'2026-05-20',
'Follow up with recruiter'
);