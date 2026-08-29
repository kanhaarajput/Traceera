package org.personal.ctmss.controllers;

import org.personal.ctmss.dtos.PatientAlertDTO;
import org.personal.ctmss.dtos.SiteKpiDTO;
import org.personal.ctmss.dtos.TrialKpiDTO;
import org.personal.ctmss.services.KpiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kpis")
public class KpiController {

    @Autowired
    private KpiService kpiService;

    @GetMapping("/trial/{id}")
    public ResponseEntity<TrialKpiDTO> getTrialKpi(@PathVariable UUID id ){
        return  ResponseEntity.ok(kpiService.getTrialKpi(id));
    }

    @GetMapping("/site/{siteId}")
    public ResponseEntity<SiteKpiDTO> getSiteKpi(@PathVariable UUID siteId) {
        return ResponseEntity.ok(kpiService.getSiteKpi(siteId));
    }

    @GetMapping("/trial/{trialId}/alerts/missed-visits")
    public ResponseEntity<List<PatientAlertDTO>> getMissedVisitAlerts(@PathVariable UUID trialId) {
        return ResponseEntity.ok(kpiService.getMissedVisitAlerts(trialId));
    }

    @GetMapping("/trial/{trialId}/alerts/attention-needed")
    public ResponseEntity<List<PatientAlertDTO>> getAttentionAlerts(@PathVariable UUID trialId) {
        return ResponseEntity.ok(kpiService.getAttentionAlerts(trialId));
    }
}
