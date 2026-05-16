CREATE OR REPLACE VIEW dashboard_summary AS
SELECT
    s.status_name,
    COUNT(*) AS total
FROM job_application ja
JOIN application_status s
ON ja.status_id = s.status_id
GROUP BY s.status_name;



CREATE OR REPLACE VIEW active_jobs AS
SELECT
    jp.job_post_id,
    jp.job_title,
    c.company_name,
    jp.deadline_date
FROM job_post jp
JOIN company c
ON jp.company_id = c.company_id
WHERE jp.deadline_date >= CURRENT_DATE;