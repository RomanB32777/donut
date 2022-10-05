create TABLE users(
    id SERIAL PRIMARY KEY,
    tronlink_token VARCHAR(255) DEFAULT '',
    metamask_token VARCHAR(255) DEFAULT '',
    near_token VARCHAR(255) DEFAULT '',
    username VARCHAR(255) UNIQUE DEFAULT '',
    roleplay VARCHAR(15) DEFAULT ''
);

create TABLE creators(
    id SERIAL PRIMARY KEY,
    avatarLink VARCHAR(255) DEFAULT '',
    backgroundLink VARCHAR(255) DEFAULT '',
    creation_date VARCHAR(255) DEFAULT '',
    welcome_text VARCHAR(255) DEFAULT '',
    btn_text VARCHAR(255) DEFAULT '',
    main_color VARCHAR(255) DEFAULT '#2B4BFB',
    background_color VARCHAR(255) DEFAULT '#212127',
    security_string VARCHAR(100) DEFAULT '',
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

create TABLE backers(
    id SERIAL PRIMARY KEY,
    avatarLink VARCHAR(255) DEFAULT '',
    twitter VARCHAR(255) DEFAULT '',
    creation_date VARCHAR(255) DEFAULT '',
    user_description VARCHAR(512) DEFAULT '',
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

create TABLE supporters(
    id SERIAL PRIMARY KEY,
    backer_id INTEGER,
    FOREIGN KEY (backer_id) REFERENCES users(id) ON DELETE SET NULL,
    sum_donations NUMERIC DEFAULT 0,
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    amount_donations NUMERIC
);

create TABLE badges(
    id SERIAL PRIMARY KEY,
    contract_address VARCHAR(255) DEFAULT '',
    blockchain VARCHAR(255) DEFAULT '',
    contributor_user_id_list VARCHAR(2047) DEFAULT '',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

create TABLE alerts (
    id VARCHAR(20) DEFAULT '' PRIMARY KEY,
    banner_link VARCHAR(255) DEFAULT '',
    message_color  VARCHAR(10) DEFAULT '#ffffff',
    name_color  VARCHAR(10) DEFAULT '#ffffff',
    sum_color VARCHAR(10) DEFAULT '#ffffff',
    duration NUMERIC DEFAULT 15,
    sound VARCHAR(255) DEFAULT 'sound_1',
    voice BOOLEAN DEFAULT 'false',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

create TABLE goals (
    id VARCHAR(20) DEFAULT '' PRIMARY KEY,
    title VARCHAR(255) DEFAULT '',
    amount_goal NUMERIC DEFAULT 1,
    amount_raised NUMERIC DEFAULT 0,
    isArchive BOOLEAN DEFAULT 'false',
    title_color VARCHAR(10) DEFAULT '#ffffff',
    progress_color VARCHAR(10) DEFAULT '#1D14FF',
    background_color VARCHAR(10) DEFAULT '#212127',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (amount_goal >= amount_raised)
);

create TABLE stats (
    id VARCHAR(20) DEFAULT '' PRIMARY KEY,
    title VARCHAR(255) DEFAULT '',
    stat_description VARCHAR(255) DEFAULT '',
    template VARCHAR(255) DEFAULT '',
    data_type VARCHAR(255) DEFAULT '',
    time_period VARCHAR(255) DEFAULT '',
    title_color VARCHAR(10) DEFAULT '#ffffff',
    bar_color VARCHAR(10) DEFAULT '#1D14FF',
    content_color VARCHAR(10) DEFAULT '#ffffff',
    aligment VARCHAR(10) DEFAULT 'Center',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

create TABLE donations(
    id SERIAL PRIMARY KEY,
    donation_date VARCHAR(63) DEFAULT '',
    backer_id INTEGER,
    FOREIGN KEY (backer_id) REFERENCES users(id) ON DELETE CASCADE,
    sum_donation NUMERIC DEFAULT 0,
    donation_message VARCHAR(255) DEFAULT '',
    blockchain VARCHAR(255) DEFAULT '',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    goal_id VARCHAR(20) DEFAULT '',
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
);

create TABLE notifications (
    id SERIAL PRIMARY KEY,
    creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sender INTEGER,
    FOREIGN KEY (sender) REFERENCES users(id) ON DELETE CASCADE,
    recipient INTEGER,
    FOREIGN KEY (recipient) REFERENCES users(id) ON DELETE CASCADE,
	donation INTEGER,
	FOREIGN KEY (donation) REFERENCES donations(id) ON DELETE CASCADE,
    badge INTEGER,
	FOREIGN KEY (badge) REFERENCES badges(id) ON DELETE CASCADE
);