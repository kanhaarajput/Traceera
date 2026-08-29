package org.personal.ctmss.services;

import org.personal.ctmss.entity.SiteStatus;
import org.personal.ctmss.entity.TrialSite;
import org.personal.ctmss.exceptions.ResourceNotFoundException;
import org.personal.ctmss.repository.TrialSiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TrialSiteService {

    @Autowired
    TrialSiteRepository trialSiteRepository;

    public List<TrialSite> createTrialSite(List<TrialSite> trialsite){
        return trialSiteRepository.saveAll(trialsite);
    }

    public Page<TrialSite> getallTrialSite(Pageable pageable){
        return trialSiteRepository.findAll(pageable);
    }

    public TrialSite getTrialSiteById(UUID id ){
        return trialSiteRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("No Site Found with id :- " + id));
    }

    public void deleteTrialSiteById(UUID id ){
        trialSiteRepository.deleteById(id);
    }

    public Page<TrialSite> findByStatus (SiteStatus status , Pageable pageble){
        return trialSiteRepository.fingByStatus(status,pageble);
    }
}
