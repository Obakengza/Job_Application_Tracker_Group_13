from django.db import connection, transaction


def ensure_sql_tables():
    with connection.cursor() as cursor:
        cursor.execute(
            """
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
            )
            """
        )
        cursor.execute(
            """
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
            )
            """
        )


def ensure_sql_user(
    *,
    email,
    first_name="",
    last_name="",
    password="not-set",
    role="user",
    phone=None,
    address=None,
    province=None,
    country=None,
):
    ensure_sql_tables()
    display_name = first_name or email.split("@")[0]

    with connection.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO users (
                first_name,
                last_name,
                email,
                password,
                phone,
                address,
                province,
                country,
                role
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (email)
            DO UPDATE SET
                first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), users.first_name),
                last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), users.last_name),
                password = COALESCE(NULLIF(EXCLUDED.password, ''), users.password),
                phone = COALESCE(EXCLUDED.phone, users.phone),
                address = COALESCE(EXCLUDED.address, users.address),
                province = COALESCE(EXCLUDED.province, users.province),
                country = COALESCE(EXCLUDED.country, users.country),
                role = CASE
                    WHEN users.role = 'admin' THEN users.role
                    ELSE EXCLUDED.role
                END
            RETURNING user_id
            """,
            [
                display_name,
                last_name or "",
                email,
                password or "not-set",
                phone,
                address,
                province,
                country,
                role or "user",
            ],
        )
        return cursor.fetchone()[0]


def log_activity(
    *,
    email,
    activity_type,
    activity_description,
    first_name="",
    last_name="",
    password="not-set",
    role="user",
    phone=None,
    address=None,
    province=None,
    country=None,
):
    with transaction.atomic():
        user_id = ensure_sql_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            role=role,
            phone=phone,
            address=address,
            province=province,
            country=country,
        )
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO activity_log (
                    user_id,
                    activity_type,
                    activity_description
                )
                VALUES (%s, %s, %s)
                """,
                [user_id, activity_type, activity_description],
            )
