CREATE TYPE UserRoles AS ENUM('creators', 'backers');

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(255) UNIQUE DEFAULT '',
    username VARCHAR(255) UNIQUE DEFAULT '',
    roleplay UserRoles DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT Now()
);

CREATE TABLE creators(
    id SERIAL PRIMARY KEY,
    header_banner VARCHAR DEFAULT '',
    background_banner VARCHAR DEFAULT '',
    welcome_text VARCHAR(255) DEFAULT 'Thank you for being my crypto supporter!',
    btn_text VARCHAR(255) DEFAULT 'Donate',
    main_color VARCHAR(255) DEFAULT '#E94560',
    background_color VARCHAR(255) DEFAULT '#1A1A2E',
    security_string VARCHAR(100) DEFAULT '',
    spam_filter BOOLEAN DEFAULT 'false',
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE badges(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) DEFAULT '',
    blockchain VARCHAR(255) DEFAULT '',
    image VARCHAR DEFAULT '',
    description VARCHAR DEFAULT '',
    token_id INTEGER,
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT Now()
);

CREATE TABLE users_assigned_badges(
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    badge_id INTEGER,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT Now()
);

CREATE TABLE alerts (
    id VARCHAR(20) DEFAULT '' PRIMARY KEY,
    banner VARCHAR(255) DEFAULT '',
    message_color  VARCHAR(10) DEFAULT '#ffffff',
    message_font VARCHAR(255) DEFAULT 'Roboto',
    name_color  VARCHAR(10) DEFAULT '#ffffff',
    name_font VARCHAR(255) DEFAULT 'Roboto',
    sum_color VARCHAR(10) DEFAULT '#ffffff',
    sum_font VARCHAR(255) DEFAULT 'Roboto',
    duration NUMERIC DEFAULT 10,
    sound VARCHAR(255) DEFAULT '',
    voice BOOLEAN DEFAULT 'false',
    gender_voice VARCHAR(10) DEFAULT 'MALE',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE goals (
    id VARCHAR(20) DEFAULT '' PRIMARY KEY,
    title VARCHAR(255) DEFAULT '',
    amount_goal NUMERIC DEFAULT 1,
    amount_raised NUMERIC DEFAULT 0,
    is_archive BOOLEAN DEFAULT 'false',
    title_color VARCHAR(10) DEFAULT '#ffffff',
    title_font VARCHAR(255) DEFAULT 'Roboto',
    progress_color VARCHAR(10) DEFAULT '#E94560',
    progress_font VARCHAR(255) DEFAULT 'Roboto',
    background_color VARCHAR(10) DEFAULT '#212127',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT Now(),
    CHECK (amount_goal >= amount_raised)
);

CREATE TABLE stats (
    id VARCHAR(20) DEFAULT '' PRIMARY KEY,
    title VARCHAR(255) DEFAULT '',
    stat_description VARCHAR(255) DEFAULT '',
    template VARCHAR(255) DEFAULT '',
    data_type VARCHAR(255) DEFAULT '',
    time_period VARCHAR(255) DEFAULT '',
    title_color VARCHAR(10) DEFAULT '#ffffff',
    title_font VARCHAR(255) DEFAULT 'Roboto',
    bar_color VARCHAR(10) DEFAULT '#E94560',
    content_color VARCHAR(10) DEFAULT '#ffffff',
    content_font VARCHAR(255) DEFAULT 'Roboto',
    aligment VARCHAR(10) DEFAULT 'Center',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT Now()
);

CREATE TABLE donations(
    id SERIAL PRIMARY KEY,
    backer_id INTEGER,
    FOREIGN KEY (backer_id) REFERENCES users(id) ON DELETE CASCADE,
    sum_donation NUMERIC DEFAULT 0,
    donation_message VARCHAR(255) DEFAULT '-',
    blockchain VARCHAR(255) DEFAULT '',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    goal_id VARCHAR(20) DEFAULT NULL,
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL,
    is_anonymous BOOLEAN DEFAULT 'false',
    created_at TIMESTAMPTZ DEFAULT Now()
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
	donation INTEGER DEFAULT NULL,
	FOREIGN KEY (donation) REFERENCES donations(id) ON DELETE CASCADE,
    badge INTEGER DEFAULT NULL,
	FOREIGN KEY (badge) REFERENCES badges(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT Now()
);

CREATE TYPE NotificationRoles AS ENUM('sender', 'recipient');

CREATE TABLE users_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    notification_id INTEGER,
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT 'false',
    visible BOOLEAN DEFAULT 'true',
    roleplay NotificationRoles DEFAULT NULL,
    UNIQUE (user_id, notification_id)
);

CREATE TABLE exchange_crypto (
    coin VARCHAR(15) DEFAULT 'ETHs' PRIMARY KEY,
    price NUMERIC DEFAULT 0,
    update_at TIMESTAMPTZ DEFAULT Now() 
);