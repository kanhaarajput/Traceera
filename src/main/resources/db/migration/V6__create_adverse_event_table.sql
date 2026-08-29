CREATE TABLE adverse_events (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                patient_id UUID NOT NULL REFERENCES patient(id),
                                description TEXT NOT NULL,
                                severity VARCHAR(20) NOT NULL,
                                reported_date DATE NOT NULL,
                                status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
                                created_at TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP
);