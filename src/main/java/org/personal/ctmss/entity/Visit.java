package org.personal.ctmss.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "visit")
public class Visit {
        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "patient_id", nullable = false)
        private Patient patient;

        @NotNull
        @Column(name = "visit_name")
        private String visitName;

        @NotNull
        @Column(name = "scheduled_date")
        private LocalDate scheduledDate;

        @Column(name = "actual_date")
        private LocalDate actualDate;

        @NotNull @Enumerated(EnumType.STRING)
        private VisitStatus status;

        private String notes;

        @Column(name = "protocol_deviation")
        private Boolean protocolDeviation = false; // flag if outside allowed window

        @CreationTimestamp
        @Column(nullable = false, updatable = false)
        private Instant created_at;
        @UpdateTimestamp
        @Column(nullable = false)
        private Instant updated_at;
}

