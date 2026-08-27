package org.personal.ctmss.services;

import org.personal.ctmss.entity.Trial;
import org.personal.ctmss.repository.TrialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrialService {

    @Autowired
    private TrialRepository trialRepository;

    public Trial createTrail(Trial trial){
        return trialRepository.save(trial);
    }

    public List<Trial> getTrails(){
        return trialRepository.findAll();
    }
}
