package org.personal.ctmss.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
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
@Table(name = "patient")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trial_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Trial trial;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TrialSite site;

    @NotNull
    private String name;

    @NotNull
    @Column(nullable = false, unique = true)
    private String uhid;

    @NotNull
    @Column(nullable = false, unique = true)
    private String patient_code;

    @Min(0)
    private Integer age;
    private String gender;
    private String randomization_arm;

    @NotNull
    private LocalDate enrollment_date;

    @NotNull
    @Enumerated(EnumType.STRING)
    private PatientStatus status;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "consent_status")
    private ConsentStatus consentStatus;

    @Column(name = "consent_date")
    private LocalDate consentDate;

    @Column(name = "withdrawal_reason")
    private String withdrawalReason;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant created_at;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updated_at;
}
