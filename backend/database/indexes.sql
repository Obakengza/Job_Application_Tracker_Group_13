CREATE INDEX idx_user_email
ON users(email);

CREATE INDEX idx_company_name
ON company(company_name);

CREATE INDEX idx_job_title
ON job_post(job_title);

CREATE INDEX idx_application_status
ON job_application(status_id);