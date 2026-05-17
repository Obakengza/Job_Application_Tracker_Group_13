CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_company_name
ON company(company_name);

CREATE INDEX idx_job_post_title
ON job_post(job_title);

CREATE INDEX idx_job_post_company
ON job_post(company_id);

CREATE INDEX idx_job_post_deadline
ON job_post(deadline_date);

CREATE INDEX idx_job_application_user
ON job_application(user_id);

CREATE INDEX idx_job_application_company
ON job_application(company_id);

CREATE INDEX idx_job_application_status
ON job_application(status_id);
