package org.personal.ctmss.repository;

import org.personal.ctmss.entity.Trial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TrialRepository extends JpaRepository<Trial, UUID> {
}
