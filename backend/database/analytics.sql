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
