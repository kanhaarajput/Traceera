CREATE TABLE trial_site(
    id UUID PRIMARY KEY default gen_random_uuid(),
    trial_id UUID NOT NULL REFERENCES trails(id),
    site_name VARCHAR(100) NOT NULL ,
    site_code VARCHAR(50) NOT NULL ,
    location VARCHAR(255) NOT NULL ,
    investigator VARCHAR(255),
    coordinatore VARCHAR(255),
    target_patient INT NOT NULL CHECK ( target_patient>0 ),
    recruited_patient INT NOT NULL DEFAULT 0 CHECK ( recruited_patient>=0 ),
    site_status VARCHAR(20) default 'PENDING',
    created_at TimeStamp NOT NULL,
    updated_at TIMESTAMP
);