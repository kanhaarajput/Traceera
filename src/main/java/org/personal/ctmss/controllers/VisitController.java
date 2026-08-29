package org.personal.ctmss.controllers;

import jakarta.validation.Valid;
import org.personal.ctmss.entity.Visit;
import org.personal.ctmss.services.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/visits")
public class VisitController {

    @Autowired
    VisitService visitService;

    @PostMapping
    public ResponseEntity<Visit> createVisit(@Valid @RequestBody Visit visit) {
        Visit result = visitService.createVisit(visit);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/by-patient/{patientId}")
    public Page<Visit> getByPatient(@PathVariable UUID patientId,
                                    @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return visitService.getVisitsByPatient(patientId, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Visit> getVisitById(@PathVariable UUID id) {
        return ResponseEntity.ok(visitService.getVisitById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Visit> updateVisit(@PathVariable UUID id, @RequestBody Visit visit) {
        return ResponseEntity.ok(visitService.updateVisit(id, visit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable UUID id) {
        visitService.deleteVisitById(id);
        return ResponseEntity.noContent().build();
    }
}