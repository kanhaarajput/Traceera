CREATE TABLE patient (
                         id UUID PRIMARY KEY,
                         trial_id UUID NOT NULL,
                         site_id UUID NOT NULL,
                         name VARCHAR(255) NOT NULL,
                         uhid VARCHAR(255) NOT NULL UNIQUE,
                         patient_code VARCHAR(255) NOT NULL UNIQUE,
                         age INTEGER,
                         gender VARCHAR(50),
                         randomization_arm VARCHAR(100),
                         enrollment_date DATE NOT NULL,
                         status VARCHAR(50) NOT NULL,
                         consent_status VARCHAR(50) NOT NULL,
                         consent_date DATE,
                         withdrawal_reason VARCHAR(500),
                         created_at TIMESTAMP NOT NULL,
                         updated_at TIMESTAMP NOT NULL,
                         CONSTRAINT fk_patient_trial FOREIGN KEY (trial_id) REFERENCES trails(id),
                         CONSTRAINT fk_patient_site FOREIGN KEY (site_id) REFERENCES trial_site(id)
);

CREATE INDEX idx_patient_trial_id ON patient(trial_id);
CREATE INDEX idx_patient_site_id ON patient(site_id);

CREATE TABLE visit (
                       id UUID PRIMARY KEY,
                       patient_id UUID NOT NULL,
                       visit_name VARCHAR(255) NOT NULL,
                       scheduled_date DATE NOT NULL,
                       actual_date DATE,
                       status VARCHAR(50) NOT NULL,
                       notes VARCHAR(1000),
                       protocol_deviation BOOLEAN NOT NULL DEFAULT FALSE,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL,
                       CONSTRAINT fk_visit_patient FOREIGN KEY (patient_id) REFERENCES patient(id)
);

CREATE INDEX idx_visit_patient_id ON visit(patient_id);