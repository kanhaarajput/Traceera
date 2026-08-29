package org.personal.ctmss.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class TrialKpiDTO {
    private UUID trialId;
    private String title;
    private int targetPatient;
    private long recruitedPatients;
    private double enrollmentPercent;
    private long protocolDeviationCount;
    private long overdueVisitCount;
}
