-- Total applications
SELECT COUNT(*) AS total_applications
FROM job_application;


-- Applications per status
SELECT
    s.status_name,
    COUNT(*) AS total
FROM job_application ja
JOIN application_status s
ON ja.status_id = s.status_id
GROUP BY s.status_name;


-- Companies receiving most applications
SELECT
    c.company_name,
    COUNT(*) AS applications
FROM company c
JOIN job_post jp
ON c.company_id = jp.company_id
JOIN job_application ja
ON jp.job_post_id = ja.job_post_id
GROUP BY c.company_name
ORDER BY applications DESC;