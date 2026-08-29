package org.personal.ctmss.repository;

import org.personal.ctmss.entity.SiteStatus;
import org.personal.ctmss.entity.TrialSite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrialSiteRepository extends JpaRepository<TrialSite, UUID> {

    Page<TrialSite> findBySiteStatus(SiteStatus status , Pageable pageble);
}
