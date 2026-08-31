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
import java.util.UUID;

@Entity
@Setter
@Getter
@Table(name="trial_site")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TrialSite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="trial_id" , nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Trial trial ;

    @NotNull
    private String site_name;

    @NotNull
    private String site_code;

    @NotNull
    private String location ;

    private String investigator ;

    private String coordinatore;
    @NotNull
    @Min(1)
    private Integer target_patient;
    @NotNull
    @Min(0)
    private Integer recruited_patient =0 ;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "site_status")
    private SiteStatus siteStatus;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant created_at;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updated_at;

}
