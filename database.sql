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
    welcome_text VARCHAR(255) DEFAULT '',
    btn_text VARCHAR(255) DEFAULT '',
    main_color VARCHAR(255) DEFAULT '#2B4BFB',
    background_color VARCHAR(255) DEFAULT '#212127',
    security_string VARCHAR(100) DEFAULT '',
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TYPE BadgeStatus AS ENUM('success', 'failed', 'pending');

CREATE TABLE badges(
    id SERIAL PRIMARY KEY,
    contract_address VARCHAR(255) DEFAULT '',
    blockchain VARCHAR(255) DEFAULT '',
    contributor_user_id_list VARCHAR(2047) DEFAULT '',
    transaction_hash VARCHAR DEFAULT '',
    transaction_status BadgeStatus DEFAULT NULL,
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT Now()
);

CREATE TABLE alerts (
    id VARCHAR(20) DEFAULT '' PRIMARY KEY,
    banner_link VARCHAR(255) DEFAULT '',
    message_color  VARCHAR(10) DEFAULT '#ffffff',
    message_font VARCHAR(255) DEFAULT 'jakarta',
    name_color  VARCHAR(10) DEFAULT '#ffffff',
    name_font VARCHAR(255) DEFAULT 'jakarta',
    sum_color VARCHAR(10) DEFAULT '#ffffff',
    sum_font VARCHAR(255) DEFAULT 'jakarta',
    duration NUMERIC DEFAULT 15,
    sound VARCHAR(255) DEFAULT 'sound_1',
    voice BOOLEAN DEFAULT 'false',
    gender_voice VARCHAR(10) DEFAULT 'MALE',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CREATE TABLE sounds (
--     id SERIAL PRIMARY KEY,
--     creator_id INTEGER,
--     FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
--     sound VARCHAR(500) DEFAULT '',
--     created_at TIMESTAMPTZ DEFAULT Now(),
--     UNIQUE (creator_id, sound)
-- );

CREATE TABLE goals (
    id VARCHAR(20) DEFAULT '' PRIMARY KEY,
    title VARCHAR(255) DEFAULT '',
    amount_goal NUMERIC DEFAULT 1,
    amount_raised NUMERIC DEFAULT 0,
    isArchive BOOLEAN DEFAULT 'false',
    title_color VARCHAR(10) DEFAULT '#ffffff',
    title_font VARCHAR(255) DEFAULT 'jakarta',
    progress_color VARCHAR(10) DEFAULT '#1D14FF',
    progress_font VARCHAR(255) DEFAULT 'jakarta',
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
    title_font VARCHAR(255) DEFAULT 'jakarta',
    bar_color VARCHAR(10) DEFAULT '#1D14FF',
    bar_font VARCHAR(255) DEFAULT 'jakarta',
    content_color VARCHAR(10) DEFAULT '#ffffff',
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
    donation_message VARCHAR(255) DEFAULT '',
    blockchain VARCHAR(255) DEFAULT '',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    goal_id VARCHAR(20) DEFAULT NULL,
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL,
    isAnonymous BOOLEAN DEFAULT 'false',
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
    roleplay NotificationRoles DEFAULT NULL,
    UNIQUE (user_id, notification_id)
);