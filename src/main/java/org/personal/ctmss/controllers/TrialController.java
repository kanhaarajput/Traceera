package org.personal.ctmss.controllers;


import jakarta.validation.Valid;
import org.personal.ctmss.entity.Trial;
import org.personal.ctmss.services.TrialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trails")
public class TrialController {

    @Autowired
    private TrialService trialService;

    @PostMapping
    public ResponseEntity<Trial> createTrail(@Valid @RequestBody Trial trial){
        Trial saved = trialService.createTrail(trial);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<Trial> getAllTrails(){
        return trialService.getTrails();
    }

}
