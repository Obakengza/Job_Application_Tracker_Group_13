-- Job Application Tracker

-- 1. View registered users
SELECT id, username, email, is_staff, date_joined
FROM auth_user;

-- 2. View user profiles
SELECT 
    u.id,
    u.username,
    u.email,
    p.phone,
    p.province,
    p.country,
    p.role
FROM auth_user u
JOIN accounts_profile p ON p.user_id = u.id;

-- 3. View application statuses
SELECT *
FROM applications_status;

-- 4. View all job applications
SELECT 
    id,
    manual_company,
    manual_job_title,
    employment_type,
    work_mode,
    application_date
FROM applications_application;

-- 5. JOIN: applications with user and status
SELECT
    a.id,
    u.username,
    a.manual_company,
    a.manual_job_title,
    a.manual_location,
    s.name AS status
FROM applications_application a
JOIN auth_user u ON a.user_id = u.id
JOIN applications_status s ON a.status_id = s.id;

-- 6. LIKE: find developer jobs
SELECT *
FROM applications_application
WHERE manual_job_title LIKE '%Developer%';

-- 7. AND: full-time remote jobs
SELECT *
FROM applications_application
WHERE employment_type = 'Full-time'
AND work_mode = 'Remote';

-- 8. OR: remote or hybrid jobs
SELECT *
FROM applications_application
WHERE work_mode = 'Remote'
OR work_mode = 'Hybrid';

-- 9. Sorting: newest applications first
SELECT
    manual_job_title,
    manual_company,
    application_date
FROM applications_application
ORDER BY application_date DESC;

-- 10. Limit rows and columns
SELECT
    manual_job_title,
    manual_company
FROM applications_application
LIMIT 5;

-- 11. Aggregate: total applications
SELECT COUNT(*) AS total_applications
FROM applications_application;

-- 12. GROUP BY: applications per user
SELECT
    user_id,
    COUNT(*) AS total_applications
FROM applications_application
GROUP BY user_id;

-- 13. HAVING: users with more than one application
SELECT
    user_id,
    COUNT(*) AS total_applications
FROM applications_application
GROUP BY user_id
HAVING COUNT(*) > 1;

-- 14. Date function: days since application
SELECT
    manual_job_title,
    application_date,
    CURRENT_DATE - application_date AS days_since_application
FROM applications_application;

-- 15. Character functions
SELECT
    UPPER(manual_company) AS company_uppercase,
    INITCAP(manual_job_title) AS formatted_job_title
FROM applications_application;

-- 16. Subquery: applications by admin/staff users
SELECT *
FROM applications_application
WHERE user_id IN (
    SELECT id
    FROM auth_user
    WHERE is_staff = true
);

-- 17. Rounding: average applications per user
SELECT
    ROUND(AVG(total_applications), 2) AS average_applications_per_user
FROM (
    SELECT user_id, COUNT(*) AS total_applications
    FROM applications_application
    GROUP BY user_id
) AS user_totals;