CREATE OR REPLACE VIEW dashboard_summary AS
SELECT
    s.status_name,
    COUNT(ja.application_id) AS total_applications
FROM application_status s
LEFT JOIN job_application ja
ON ja.status_id = s.status_id
GROUP BY s.status_name;

CREATE OR REPLACE VIEW active_jobs AS
SELECT
    jp.job_post_id,
    jp.job_title,
    c.company_name,
    c.location AS company_location,
    jp.salary,
    jp.employment_type,
    jp.work_mode,
    jp.post_date,
    jp.deadline_date
FROM job_post jp
JOIN company c
ON jp.company_id = c.company_id
WHERE jp.is_active = TRUE
AND jp.deadline_date >= CURRENT_DATE;

CREATE OR REPLACE VIEW application_details AS
SELECT
    ja.application_id,
    u.first_name || ' ' || u.last_name AS applicant_name,
    u.email,
    c.company_name,
    ja.job_title,
    s.status_name,
    ja.application_date,
    ja.employment_type,
    ja.work_mode
FROM job_application ja
JOIN users u
ON ja.user_id = u.user_id
JOIN company c
ON ja.company_id = c.company_id
JOIN application_status s
ON ja.status_id = s.status_id;
