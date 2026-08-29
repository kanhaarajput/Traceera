package org.personal.ctmss.controllers;

import jakarta.validation.Valid;
import org.personal.ctmss.entity.Patient;
import org.personal.ctmss.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    PatientService patientService;

    @PostMapping
    public ResponseEntity<Patient> createPatient(@Valid @RequestBody Patient patient) {
        Patient result = patientService.createPatient(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping
    public Page<Patient> getAllPatients(@PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return patientService.getAllPatients(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable UUID id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/by-trial/{trialId}")
    public Page<Patient> getByTrial(@PathVariable UUID trialId,
                                    @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return patientService.getPatientsByTrial(trialId, pageable);
    }

    @GetMapping("/by-site/{siteId}")
    public Page<Patient> getBySite(@PathVariable UUID siteId,
                                   @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return patientService.getPatientsBySite(siteId, pageable);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable UUID id, @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.updatePatient(id, patient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable UUID id) {
        patientService.deletePatientById(id);
        return ResponseEntity.noContent().build();
    }
}