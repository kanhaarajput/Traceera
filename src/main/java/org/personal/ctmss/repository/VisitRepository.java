package org.personal.ctmss.repository;

import org.personal.ctmss.entity.Visit;
import org.personal.ctmss.entity.VisitStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VisitRepository extends JpaRepository<Visit, UUID> {

    Page<Visit> findByPatient_Id(UUID patientId, Pageable pageable);
    @Query("SELECT COUNT(v) FROM Visit v WHERE v.patient.trial.id = :trialId AND v.protocolDeviation = true")
    long countDeviationsByTrial(@Param("trialId") UUID trialId);
    @Query("SELECT COUNT(v) FROM Visit v WHERE v.patient.trial.id = :trialId " +
            "AND v.status = :status AND v.scheduledDate < CURRENT_DATE")
    long countOverdueVisitsByTrial(@Param("trialId") UUID trialId, @Param("status") VisitStatus status);

    @Query("SELECT COUNT(v) FROM Visit v WHERE v.patient.site.id = :siteId AND v.protocolDeviation = true")
    long countDeviationsBySite(@Param("siteId") UUID siteId);

    @Query("SELECT COUNT(v) FROM Visit v WHERE v.patient.site.id = :siteId " +
            "AND v.status = :status AND v.scheduledDate < CURRENT_DATE")
    long countOverdueVisitsBySite(@Param("siteId") UUID siteId, @Param("status") VisitStatus status);

    long countByPatient_IdAndStatus(UUID patientId, VisitStatus status);
}