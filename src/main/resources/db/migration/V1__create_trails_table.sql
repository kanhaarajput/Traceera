CREATE TYPE status_enum AS ENUM ('Active','Pending','Rejected','Cancelled','Planned','Completed');
Create table trails (
    id UUID Primary Key default gen_random_uuid(),
    protocol_no VARCHAR(100) NOT NULL UNIQUE ,
    trail_code VARCHAR(50),
    title TEXT ,
    short_title VARCHAR(255),
    study_type VARCHAR(50),
    study_phase VARCHAR(50),
    status status_enum NOT Null Default 'Planned',
    sponsor_team VARCHAR(100),
    principle_investigator VARCHAR(255),
    intervention_name VARCHAR(100),
    intervention_type VARCHAR(100),
    target_patient INTEGER ,
    start_date DATE ,
    expected_end_date DATE,
    actual_end_date DATE,
    description TEXT,
    primary_objective TEXT,
    secondary_objective TEXT ,
    createdAt TIMESTAMP NOT NULL ,
    updatedAt TimeStamp
    )