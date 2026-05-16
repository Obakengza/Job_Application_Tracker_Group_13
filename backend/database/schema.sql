CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    province VARCHAR(100),
    country VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company (
    company_id SERIAL PRIMARY KEY,

    company_name VARCHAR(255) UNIQUE NOT NULL,

    location VARCHAR(255),

    website VARCHAR(255),

    industry VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_status (
    status_id SERIAL PRIMARY KEY,

    status_name VARCHAR(50) UNIQUE NOT NULL,

    description TEXT
);

CREATE TABLE IF NOT EXISTS job_post (
    job_post_id SERIAL PRIMARY KEY,

    company_id INT NOT NULL,

    job_title VARCHAR(255) NOT NULL,

    job_description TEXT NOT NULL,

    industry VARCHAR(100),

    salary DECIMAL(10,2),

    employment_type VARCHAR(50),

    work_mode VARCHAR(50),

    experience_level VARCHAR(50),

    post_date DATE DEFAULT CURRENT_DATE,

    deadline_date DATE NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_jobpost_company
    FOREIGN KEY (company_id)
    REFERENCES company(company_id)
    ON DELETE CASCADE,

    CONSTRAINT chk_salary
    CHECK (salary >= 0),

    CONSTRAINT chk_employment_type
    CHECK (
        employment_type IN (
            'Full-time',
            'Part-time',
            'Internship',
            'Contract'
        )
    ),

    CONSTRAINT chk_work_mode
    CHECK (
        work_mode IN (
            'Remote',
            'Hybrid',
            'Onsite'
        )
    ),

    CONSTRAINT chk_experience_level
    CHECK (
        experience_level IN (
            'Entry',
            'Mid',
            'Senior'
        )
    ),

    CONSTRAINT chk_deadline_date
    CHECK (deadline_date >= post_date)
);

CREATE TABLE IF NOT EXISTS job_application (
    application_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    job_post_id INT NOT NULL,

    status_id INT NOT NULL,

    application_date DATE DEFAULT CURRENT_DATE,

    cv_uploaded BOOLEAN DEFAULT FALSE,

    cover_letter_uploaded BOOLEAN DEFAULT FALSE,

    expected_salary DECIMAL(10,2),

    notes TEXT,

    CONSTRAINT fk_application_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_application_jobpost
    FOREIGN KEY (job_post_id)
    REFERENCES job_post(job_post_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_application_status
    FOREIGN KEY (status_id)
    REFERENCES application_status(status_id),

    CONSTRAINT chk_expected_salary
    CHECK (expected_salary >= 0)
);


CREATE TABLE IF NOT EXISTS interview (
    interview_id SERIAL PRIMARY KEY,

    application_id INT NOT NULL,

    interview_date TIMESTAMP NOT NULL,

    interview_type VARCHAR(50),

    interviewer_name VARCHAR(255),

    meeting_link TEXT,

    location VARCHAR(255),

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_interview_application
    FOREIGN KEY (application_id)
    REFERENCES job_application(application_id)
    ON DELETE CASCADE,

    CONSTRAINT chk_interview_type
    CHECK (
        interview_type IN (
            'Technical',
            'HR',
            'Final',
            'Screening'
        )
    )
);

CREATE TABLE IF NOT EXISTS reminder (
    reminder_id SERIAL PRIMARY KEY,

    application_id INT NOT NULL,

    reminder_date DATE NOT NULL,

    message TEXT NOT NULL,

    is_completed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reminder_application
    FOREIGN KEY (application_id)
    REFERENCES job_application(application_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_log (
    log_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    activity_type VARCHAR(100) NOT NULL,

    activity_description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);