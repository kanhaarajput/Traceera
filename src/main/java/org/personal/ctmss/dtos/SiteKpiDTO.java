package org.personal.ctmss.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class SiteKpiDTO {
    private UUID siteId;
    private String siteName;
    private int targetPatient;
    private int recruitedPatient;
    private double enrollmentPercent;
    private long protocolDeviationCount;
    private long overdueVisitCount;
}