-- Job Application Tracker Presentation Queries
-- Database: job_tracker
--
-- This is one synced query set. It follows the system workflow and also
-- covers the marking rubric requirements.
--
-- Workflow order:
-- 1. Admin login
-- 2. Admin posts jobs
-- 3. User signs up
-- 4. User signs in
-- 5. User edits profile
-- 6. User applies from job posts
-- 7. User changes job tracking status
-- 8. User adds a manual tracked job
-- 9. User views dashboard
-- 10. User logs out


-- 1. ADMIN LOGIN
-- Rubric: query limitation, sorting
SELECT
    al.log_id,
    u.user_id,
    u.email,
    u.role,
    al.activity_type,
    al.activity_description,
    al.created_at
FROM activity_log al
JOIN users u ON al.user_id = u.user_id
WHERE al.activity_type = 'admin_login'
ORDER BY al.created_at DESC
LIMIT 5;


-- 2. ADMIN POSTS JOBS
-- Rubric: company information requirements, joins, sorting
SELECT
    jp.id AS job_post_id,
    c.company_name,
    jp.job_title,
    jp.location,
    jp.salary,
    jp.employment_type,
    jp.work_mode,
    jp.post_date,
    jp.deadline_date
FROM jobs_jobpost jp
LEFT JOIN jobs_company c ON jp.company_id = c.id
ORDER BY jp.post_date DESC, jp.deadline_date ASC;


-- 3. ADMIN JOB POST ACTIVITY
-- Rubric: joins, sorting, LIKE
SELECT
    al.log_id,
    u.email AS admin_email,
    al.activity_type,
    al.activity_description,
    al.created_at
FROM activity_log al
JOIN users u ON al.user_id = u.user_id
WHERE al.activity_type IN ('job_post_created', 'job_post_updated')
AND al.activity_description ILIKE '%job post%'
ORDER BY al.created_at DESC;


-- 4. USER SIGNS UP
-- Rubric: query limitation, sorting
SELECT
    user_id,
    first_name,
    last_name,
    email,
    role,
    created_at
FROM users
WHERE role = 'user'
ORDER BY created_at DESC
LIMIT 10;


-- 5. USER SIGNUP ACTIVITY
-- Rubric: joins, sorting
SELECT
    al.log_id,
    u.user_id,
    u.email,
    al.activity_type,
    al.activity_description,
    al.created_at
FROM activity_log al
JOIN users u ON al.user_id = u.user_id
WHERE al.activity_type = 'signup'
ORDER BY al.created_at DESC;


-- 6. USER SIGNS IN
-- Rubric: joins, sorting
SELECT
    al.log_id,
    u.user_id,
    u.email,
    al.activity_type,
    al.activity_description,
    al.created_at
FROM activity_log al
JOIN users u ON al.user_id = u.user_id
WHERE al.activity_type = 'login'
ORDER BY al.created_at DESC;


-- 7. USER EDITS PROFILE PAGE
-- Rubric: joins, character functions, query limitation
SELECT
    au.id AS django_user_id,
    u.user_id,
    INITCAP(au.first_name) AS first_name,
    INITCAP(au.last_name) AS last_name,
    LOWER(au.email) AS email,
    p.phone,
    p.province,
    p.country,
    p.role,
    p.bio,
    p.university,
    p.qualification,
    p.certificates,
    CASE
        WHEN p.profile_picture IS NULL OR p.profile_picture = '' THEN 'No picture saved'
        ELSE 'Picture saved'
    END AS profile_picture_status
FROM auth_user au
JOIN accounts_profile p ON p.user_id = au.id
LEFT JOIN users u ON u.email = au.email
ORDER BY au.id
LIMIT 10;


-- 8. PROFILE EDIT ACTIVITY
-- Rubric: joins, sorting
SELECT
    al.log_id,
    u.user_id,
    u.email,
    al.activity_type,
    al.activity_description,
    al.created_at
FROM activity_log al
JOIN users u ON al.user_id = u.user_id
WHERE al.activity_type = 'profile_update'
ORDER BY al.created_at DESC;


-- 9. USER GOES TO JOB POSTS AND APPLIES
-- Rubric: company information requirements, joins, sorting
SELECT
    aa.id AS application_id,
    u.user_id,
    au.email,
    jp.job_title,
    c.company_name,
    jp.salary,
    jp.employment_type,
    jp.work_mode,
    s.name AS status,
    aa.application_date
FROM applications_application aa
JOIN auth_user au ON aa.user_id = au.id
LEFT JOIN users u ON u.email = au.email
JOIN jobs_jobpost jp ON aa.job_post_id = jp.id
LEFT JOIN jobs_company c ON jp.company_id = c.id
JOIN applications_status s ON aa.status_id = s.id
ORDER BY aa.application_date DESC;


-- 10. APPLY ACTIVITY
-- Rubric: joins, sorting
SELECT
    al.log_id,
    u.user_id,
    u.email,
    al.activity_type,
    al.activity_description,
    al.created_at
FROM activity_log al
JOIN users u ON al.user_id = u.user_id
WHERE al.activity_type = 'job_applied'
ORDER BY al.created_at DESC;


-- 11. USER CHANGES JOB TRACKING STATUS
-- Rubric: joins, AND operator, sorting
SELECT
    aa.id AS application_id,
    u.user_id,
    au.email,
    COALESCE(jp.job_title, aa.manual_job_title) AS job_title,
    COALESCE(c.company_name, aa.manual_company, 'No Company') AS company_name,
    s.name AS current_status,
    aa.updated_at
FROM applications_application aa
JOIN auth_user au ON aa.user_id = au.id
LEFT JOIN users u ON u.email = au.email
LEFT JOIN jobs_jobpost jp ON aa.job_post_id = jp.id
LEFT JOIN jobs_company c ON jp.company_id = c.id
JOIN applications_status s ON aa.status_id = s.id
WHERE s.name IN ('Applied', 'Interview', 'Accepted', 'Rejected')
AND aa.updated_at IS NOT NULL
ORDER BY aa.updated_at DESC;


-- 12. STATUS CHANGE ACTIVITY
-- Rubric: joins, sorting
SELECT
    al.log_id,
    u.user_id,
    u.email,
    al.activity_type,
    al.activity_description,
    al.created_at
FROM activity_log al
JOIN users u ON al.user_id = u.user_id
WHERE al.activity_type = 'application_updated'
ORDER BY al.created_at DESC;


-- 13. USER ADDS A JOB MANUALLY IN JOB TRACKING
-- Rubric: joins, OR operator, sorting
SELECT
    aa.id AS application_id,
    u.user_id,
    au.email,
    aa.manual_job_title AS job_title,
    aa.manual_company AS company_name,
    aa.manual_location AS location,
    s.name AS status,
    aa.application_date,
    aa.interview_date,
    aa.note
FROM applications_application aa
JOIN auth_user au ON aa.user_id = au.id
LEFT JOIN users u ON u.email = au.email
JOIN applications_status s ON aa.status_id = s.id
WHERE aa.job_post_id IS NULL
OR aa.manual_job_title IS NOT NULL
ORDER BY aa.created_at DESC;


-- 14. MANUAL JOB TRACKING ACTIVITY
-- Rubric: joins, sorting
SELECT
    al.log_id,
    u.user_id,
    u.email,
    al.activity_type,
    al.activity_description,
    al.created_at
FROM activity_log al
JOIN users u ON al.user_id = u.user_id
WHERE al.activity_type = 'manual_application_created'
ORDER BY al.created_at DESC;


-- 15. USER DASHBOARD SUMMARY
-- Rubric: aggregate functions, GROUP BY, HAVING, joins
SELECT
    au.email,
    COUNT(aa.id) AS total_applications,
    COUNT(aa.id) FILTER (WHERE s.name = 'Applied') AS applied,
    COUNT(aa.id) FILTER (WHERE s.name = 'Interview') AS interviews,
    COUNT(aa.id) FILTER (WHERE s.name = 'Accepted') AS accepted,
    COUNT(aa.id) FILTER (WHERE s.name = 'Rejected') AS rejected
FROM auth_user au
LEFT JOIN applications_application aa ON aa.user_id = au.id
LEFT JOIN applications_status s ON aa.status_id = s.id
GROUP BY au.email
HAVING COUNT(aa.id) >= 0
ORDER BY au.email;


-- 16. COMPANY JOB POST STATISTICS
-- Rubric: company information requirements, aggregate functions,
-- GROUP BY, HAVING, rounding/truncation
SELECT
    c.company_name,
    COUNT(jp.id) AS total_posts,
    MIN(jp.salary) AS lowest_salary,
    MAX(jp.salary) AS highest_salary,
    ROUND(AVG(jp.salary), 2) AS rounded_average_salary,
    TRUNC(AVG(jp.salary), 0) AS truncated_average_salary
FROM jobs_company c
JOIN jobs_jobpost jp ON jp.company_id = c.id
GROUP BY c.company_name
HAVING COUNT(jp.id) >= 1
ORDER BY total_posts DESC;


-- 17. JOB CLOSING DATES
-- Rubric: date functions, sorting
SELECT
    jp.job_title,
    c.company_name,
    CURRENT_DATE AS today,
    jp.deadline_date,
    jp.deadline_date - CURRENT_DATE AS days_until_closing
FROM jobs_jobpost jp
LEFT JOIN jobs_company c ON jp.company_id = c.id
WHERE jp.deadline_date IS NOT NULL
ORDER BY jp.deadline_date ASC;


-- 18. SEARCH JOB POSTS WITH VARIABLE
-- Rubric: variables, character functions, LIKE
WITH search_value AS (
    SELECT 'data'::VARCHAR AS keyword
)
SELECT
    UPPER(c.company_name) AS company_uppercase,
    INITCAP(jp.job_title) AS formatted_job_title,
    LOWER(jp.work_mode) AS work_mode_lowercase,
    LENGTH(jp.job_title) AS title_length,
    jp.salary
FROM jobs_jobpost jp
LEFT JOIN jobs_company c ON jp.company_id = c.id
CROSS JOIN search_value sv
WHERE LOWER(jp.job_title) LIKE '%' || sv.keyword || '%'
ORDER BY jp.job_title;


-- 19. SUB-QUERY: USERS WHO HAVE APPLICATIONS
-- Rubric: sub-query
SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    u.email
FROM users u
WHERE u.email IN (
    SELECT au.email
    FROM applications_application aa
    JOIN auth_user au ON aa.user_id = au.id
)
ORDER BY u.user_id;


-- 20. SUB-QUERY: JOB POSTS ABOVE AVERAGE SALARY
-- Rubric: sub-query, rounding, sorting
SELECT
    jp.job_title,
    c.company_name,
    jp.salary,
    ROUND((
        SELECT AVG(salary)
        FROM jobs_jobpost
        WHERE salary IS NOT NULL
    ), 2) AS average_salary
FROM jobs_jobpost jp
LEFT JOIN jobs_company c ON jp.company_id = c.id
WHERE jp.salary > (
    SELECT AVG(salary)
    FROM jobs_jobpost
    WHERE salary IS NOT NULL
)
ORDER BY jp.salary DESC;


-- 21. USER LOGOUT ACTIVITY
-- Rubric: joins, sorting
SELECT
    al.log_id,
    u.user_id,
    u.email,
    al.activity_type,
    al.activity_description,
    al.created_at
FROM activity_log al
JOIN users u ON al.user_id = u.user_id
WHERE al.activity_type = 'logout'
ORDER BY al.created_at DESC;


-- 22. FULL SYSTEM ACTIVITY IN PRESENTATION ORDER
-- Rubric: joins, sorting, CASE expression
SELECT
    al.log_id,
    u.user_id,
    u.email,
    u.role,
    al.activity_type,
    al.activity_description,
    al.created_at,
    CASE al.activity_type
        WHEN 'admin_login' THEN 1
        WHEN 'job_post_created' THEN 2
        WHEN 'job_post_updated' THEN 3
        WHEN 'signup' THEN 4
        WHEN 'login' THEN 5
        WHEN 'profile_update' THEN 6
        WHEN 'job_applied' THEN 7
        WHEN 'application_updated' THEN 8
        WHEN 'manual_application_created' THEN 9
        WHEN 'logout' THEN 10
        ELSE 99
    END AS presentation_step
FROM activity_log al
JOIN users u ON al.user_id = u.user_id
ORDER BY presentation_step ASC, al.created_at ASC, al.log_id ASC;
