package org.personal.ctmss.services;

import org.personal.ctmss.dtos.AdverseEventRequest;
import org.personal.ctmss.dtos.AdverseEventResponse;
import org.personal.ctmss.entity.AdverseEvent;
import org.personal.ctmss.entity.AeSeverity;
import org.personal.ctmss.entity.AeStatus;
import org.personal.ctmss.entity.Patient;
import org.personal.ctmss.exceptions.ResourceNotFoundException;
import org.personal.ctmss.repository.AdverseEventRepository;
import org.personal.ctmss.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdverseEventService {

    private final AdverseEventRepository adverseEventRepository;
    private final PatientRepository patientRepository;

    public AdverseEventService(AdverseEventRepository adverseEventRepository,
                               PatientRepository patientRepository) {
        this.adverseEventRepository = adverseEventRepository;
        this.patientRepository = patientRepository;
    }

    public AdverseEventResponse createAdverseEvent(AdverseEventRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + request.getPatientId()));

        AdverseEvent ae = new AdverseEvent();
        ae.setPatient(patient);
        ae.setDescription(request.getDescription());
        ae.setSeverity(AeSeverity.valueOf(request.getSeverity()));
        ae.setReportedDate(request.getReportedDate());

        AdverseEvent saved = adverseEventRepository.save(ae);
        return toResponse(saved);
    }

    public List<AdverseEventResponse> getByPatient(UUID patientId) {
        return adverseEventRepository.findByPatient_Id(patientId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AdverseEventResponse updateStatus(UUID aeId, String newStatus) {
        AdverseEvent ae = adverseEventRepository.findById(aeId)
                .orElseThrow(() -> new ResourceNotFoundException("Adverse event not found: " + aeId));

        ae.setStatus(AeStatus.valueOf(newStatus));
        AdverseEvent saved = adverseEventRepository.save(ae);
        return toResponse(saved);
    }

    private AdverseEventResponse toResponse(AdverseEvent ae) {
        return new AdverseEventResponse(
                ae.getId(),
                ae.getPatient().getId(),
                ae.getPatient().getName(),
                ae.getDescription(),
                ae.getSeverity().name(),
                ae.getStatus().name(),
                ae.getReportedDate()
        );
    }
}