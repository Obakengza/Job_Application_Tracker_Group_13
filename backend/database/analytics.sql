SELECT
    c.company_name,
    COUNT(ja.application_id) AS total_applications
FROM company c
JOIN job_application ja
ON c.company_id = ja.company_id
GROUP BY c.company_name
ORDER BY total_applications DESC;
