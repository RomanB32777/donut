create TABLE users(
    id SERIAL PRIMARY KEY,
    tron_token VARCHAR(255) DEFAULT '',
    username VARCHAR(255) DEFAULT '',
    roleplay VARCHAR(15) DEFAULT ''
);

create TABLE creators(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) DEFAULT '',
    person_name VARCHAR(255) DEFAULT '',
    avatarLink VARCHAR(255) DEFAULT '',
    backgroundLink VARCHAR(255) DEFAULT '',
    twitter VARCHAR(255) DEFAULT '',
    google VARCHAR(255) DEFAULT '',
    facebook VARCHAR(255) DEFAULT '',
    discord VARCHAR(255) DEFAULT '',
    creation_date VARCHAR(255) DEFAULT '',
    user_description VARCHAR(512) DEFAULT '',
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

create TABLE backers(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) DEFAULT '',
    person_name VARCHAR(255) DEFAULT '',
    avatarLink VARCHAR(255) DEFAULT '',
    twitter VARCHAR(255) DEFAULT '',
    google VARCHAR(255) DEFAULT '',
    facebook VARCHAR(255) DEFAULT '',
    discord VARCHAR(255) DEFAULT '',
    creation_date VARCHAR(255) DEFAULT '',
    user_description VARCHAR(512) DEFAULT '',
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

create TABLE supporters(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) DEFAULT '',
    backer_id INTEGER,
    sum_donations VARCHAR(63) DEFAULT '',
    creator_id INTEGER,
    amount_donations INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

create TABLE donations(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) DEFAULT '',
    donation_date VARCHAR(63) DEFAULT '',
    backer_id INTEGER,
    sum_donation VARCHAR(63) DEFAULT '',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

create TABLE badges(
    id SERIAL PRIMARY KEY,
    owner_user_id INTEGER,
    contributor_user_id_list VARCHAR(2047) DEFAULT '',
    badge_name VARCHAR(255) DEFAULT '',
    badge_desc VARCHAR(1023) DEFAULT '',
    badge_image VARCHAR(255) DEFAULT '',
    link VARCHAR(512) DEFAULT '',
    quantity INTEGER,
    owners_quantity INTEGER
);

create TABLE collections(
    id SERIAL PRIMARY KEY,
    collection_name VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

create TABLE nft(
    id SERIAL PRIMARY KEY,
    nft_name VARCHAR(255) DEFAULT '',
    nft_desc VARCHAR(255) DEFAULT '',
    nft_link VARCHAR(255) DEFAULT '',
    nft_image VARCHAR(255) DEFAULT '',
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);


