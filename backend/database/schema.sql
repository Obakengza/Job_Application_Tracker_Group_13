DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS reminder CASCADE;
DROP TABLE IF EXISTS interview CASCADE;
DROP TABLE IF EXISTS job_application CASCADE;
DROP TABLE IF EXISTS job_post CASCADE;
DROP TABLE IF EXISTS application_status CASCADE;
DROP TABLE IF EXISTS company CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    province VARCHAR(100),
    country VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_user_role
    CHECK (role IN ('user', 'admin'))
);

CREATE TABLE company (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255),
    website VARCHAR(255),
    industry VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_status (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE job_post (
    job_post_id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL,
    company_id INT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT NOT NULL,
    industry VARCHAR(100),
    salary DECIMAL(10,2),
    employment_type VARCHAR(50),
    work_mode VARCHAR(50),
    experience_level VARCHAR(50),
    post_date DATE NOT NULL DEFAULT CURRENT_DATE,
    deadline_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_jobpost_admin
    FOREIGN KEY (admin_id)
    REFERENCES users(user_id)
    ON DELETE RESTRICT,

    CONSTRAINT fk_jobpost_company
    FOREIGN KEY (company_id)
    REFERENCES company(company_id)
    ON DELETE CASCADE,

    CONSTRAINT chk_jobpost_salary
    CHECK (salary IS NULL OR salary >= 0),

    CONSTRAINT chk_jobpost_employment_type
    CHECK (
        employment_type IS NULL OR employment_type IN (
            'Full-time',
            'Part-time',
            'Internship',
            'Contract'
        )
    ),

    CONSTRAINT chk_jobpost_work_mode
    CHECK (
        work_mode IS NULL OR work_mode IN (
            'Remote',
            'Hybrid',
            'Onsite'
        )
    ),

    CONSTRAINT chk_jobpost_experience_level
    CHECK (
        experience_level IS NULL OR experience_level IN (
            'Entry',
            'Mid',
            'Senior'
        )
    ),

    CONSTRAINT chk_jobpost_deadline
    CHECK (deadline_date >= post_date)
);

CREATE TABLE job_application (
    application_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    company_id INT NOT NULL,
    job_post_id INT NOT NULL,
    status_id INT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    employment_type VARCHAR(50) NOT NULL,
    work_mode VARCHAR(50) NOT NULL,
    cv_uploaded BOOLEAN NOT NULL DEFAULT FALSE,
    cover_letter_uploaded BOOLEAN NOT NULL DEFAULT FALSE,
    expected_salary DECIMAL(10,2),
    notes TEXT,

    CONSTRAINT fk_application_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_application_company
    FOREIGN KEY (company_id)
    REFERENCES company(company_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_application_jobpost
    FOREIGN KEY (job_post_id)
    REFERENCES job_post(job_post_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_application_status
    FOREIGN KEY (status_id)
    REFERENCES application_status(status_id)
    ON DELETE RESTRICT,

    CONSTRAINT uq_user_jobpost
    UNIQUE (user_id, job_post_id),

    CONSTRAINT chk_application_expected_salary
    CHECK (expected_salary IS NULL OR expected_salary >= 0),

    CONSTRAINT chk_application_employment_type
    CHECK (
        employment_type IN (
            'Full-time',
            'Part-time',
            'Internship',
            'Contract'
        )
    ),

    CONSTRAINT chk_application_work_mode
    CHECK (
        work_mode IN (
            'Remote',
            'Hybrid',
            'Onsite'
        )
    )
);

CREATE TABLE interview (
    interview_id SERIAL PRIMARY KEY,
    application_id INT NOT NULL,
    interview_date TIMESTAMP NOT NULL,
    interview_type VARCHAR(50),
    interviewer_name VARCHAR(255),
    meeting_link TEXT,
    location VARCHAR(255),
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_interview_application
    FOREIGN KEY (application_id)
    REFERENCES job_application(application_id)
    ON DELETE CASCADE,

    CONSTRAINT chk_interview_type
    CHECK (
        interview_type IS NULL OR interview_type IN (
            'Technical',
            'HR',
            'Final',
            'Screening'
        )
    )
);

CREATE TABLE reminder (
    reminder_id SERIAL PRIMARY KEY,
    application_id INT NOT NULL,
    reminder_date DATE NOT NULL,
    message TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reminder_application
    FOREIGN KEY (application_id)
    REFERENCES job_application(application_id)
    ON DELETE CASCADE
);

CREATE TABLE activity_log (
    log_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION validate_interview_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.interview_date < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Interview date cannot be in the past';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_interview_date
BEFORE INSERT ON interview
FOR EACH ROW
EXECUTE FUNCTION validate_interview_date();

CREATE OR REPLACE FUNCTION validate_reminder_date()
RETURNS TRIGGER AS $$
DECLARE
    app_date DATE;
BEGIN
    SELECT application_date
    INTO app_date
    FROM job_application
    WHERE application_id = NEW.application_id;

    IF NEW.reminder_date < app_date THEN
        RAISE EXCEPTION 'Reminder date cannot be earlier than application date';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_reminder_date
BEFORE INSERT OR UPDATE ON reminder
FOR EACH ROW
EXECUTE FUNCTION validate_reminder_date();
