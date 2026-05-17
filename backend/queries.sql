-- Job Application Tracker Queries
-- These queries use the submitted conceptual design table names.

-- 1. Company information: list all companies
SELECT
    company_id,
    company_name,
    location,
    website,
    industry
FROM company;

-- 2. Company information: active job posts per company
SELECT
    c.company_name,
    jp.job_title,
    jp.salary,
    jp.employment_type,
    jp.work_mode,
    jp.deadline_date
FROM company c
JOIN job_post jp
ON c.company_id = jp.company_id
WHERE jp.is_active = TRUE
AND jp.deadline_date >= CURRENT_DATE;

-- 3. Company information: total applications received per company
SELECT
    c.company_name,
    COUNT(ja.application_id) AS total_applications
FROM company c
LEFT JOIN job_application ja
ON c.company_id = ja.company_id
GROUP BY c.company_name
ORDER BY total_applications DESC;

-- 4. Query limitation: show selected columns and first five job posts
SELECT
    job_title,
    salary,
    deadline_date
FROM job_post
LIMIT 5;

-- 5. Sorting: newest applications first
SELECT
    job_title,
    application_date,
    employment_type
FROM job_application
ORDER BY application_date DESC;

-- 6. LIKE: find jobs with developer in the title
SELECT
    job_post_id,
    job_title,
    salary
FROM job_post
WHERE job_title LIKE '%Developer%';

-- 7. AND operator: full-time remote jobs
SELECT
    job_title,
    employment_type,
    work_mode
FROM job_post
WHERE employment_type = 'Full-time'
AND work_mode = 'Remote';

-- 8. OR operator: remote or hybrid jobs
SELECT
    job_title,
    work_mode
FROM job_post
WHERE work_mode = 'Remote'
OR work_mode = 'Hybrid';

-- 9. Variable and character functions using a CTE parameter
WITH search_variable AS (
    SELECT 'data'::VARCHAR AS keyword
)
SELECT
    UPPER(c.company_name) AS company_uppercase,
    INITCAP(jp.job_title) AS formatted_job_title
FROM job_post jp
JOIN company c
ON jp.company_id = c.company_id
CROSS JOIN search_variable sv
WHERE LOWER(jp.job_title) LIKE '%' || sv.keyword || '%';

-- 10. Rounding and truncation: average salary
SELECT
    ROUND(AVG(salary), 2) AS rounded_average_salary,
    TRUNC(AVG(salary), 0) AS truncated_average_salary
FROM job_post
WHERE salary IS NOT NULL;

-- 11. Date functions: days until job post deadline
SELECT
    job_title,
    deadline_date,
    deadline_date - CURRENT_DATE AS days_until_deadline
FROM job_post
WHERE deadline_date >= CURRENT_DATE;

-- 12. Aggregate functions: totals and salary statistics
SELECT
    COUNT(*) AS total_job_posts,
    MIN(salary) AS lowest_salary,
    MAX(salary) AS highest_salary,
    ROUND(AVG(salary), 2) AS average_salary
FROM job_post;

-- 13. GROUP BY: applications per status
SELECT
    s.status_name,
    COUNT(ja.application_id) AS total_applications
FROM application_status s
LEFT JOIN job_application ja
ON s.status_id = ja.status_id
GROUP BY s.status_name;

-- 14. HAVING: companies with more than one job post
SELECT
    c.company_name,
    COUNT(jp.job_post_id) AS total_posts
FROM company c
JOIN job_post jp
ON c.company_id = jp.company_id
GROUP BY c.company_name
HAVING COUNT(jp.job_post_id) > 1;

-- 15. JOIN: full application details
SELECT
    ja.application_id,
    u.first_name || ' ' || u.last_name AS applicant_name,
    c.company_name,
    ja.job_title,
    s.status_name,
    ja.application_date
FROM job_application ja
JOIN users u
ON ja.user_id = u.user_id
JOIN company c
ON ja.company_id = c.company_id
JOIN application_status s
ON ja.status_id = s.status_id;

-- 16. JOIN: job posts created by admins
SELECT
    jp.job_title,
    c.company_name,
    u.email AS admin_email,
    jp.post_date
FROM job_post jp
JOIN users u
ON jp.admin_id = u.user_id
JOIN company c
ON jp.company_id = c.company_id
WHERE u.role = 'admin';

-- 17. Subquery: users who have applied for jobs
SELECT
    user_id,
    first_name,
    last_name,
    email
FROM users
WHERE user_id IN (
    SELECT user_id
    FROM job_application
);

-- 18. Subquery: job posts with salary above the average salary
SELECT
    job_title,
    salary
FROM job_post
WHERE salary > (
    SELECT AVG(salary)
    FROM job_post
);

-- 19. View query: dashboard summary
SELECT
    status_name,
    total_applications
FROM dashboard_summary;

-- 20. View query: active jobs visible to users
SELECT
    job_post_id,
    job_title,
    company_name,
    salary,
    deadline_date
FROM active_jobs;
