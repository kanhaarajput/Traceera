package org.personal.ctmss.repository;

import org.personal.ctmss.entity.Patient;
import org.personal.ctmss.entity.PatientStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {

    Page<Patient> findByTrial_Id(UUID trialId, Pageable pageable);
    List<Patient> findByTrial_Id(UUID trialId);

    Page<Patient> findBySite_Id(UUID siteId, Pageable pageable);
    long countByTrial_IdAndStatusNot(UUID trialId, PatientStatus status);
}