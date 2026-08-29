package org.personal.ctmss.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class PatientAlertDTO {
    private UUID patientId;
    private String patientName;
    private String uhid;
    private String siteName;
    private String trialTitle;
    private String type;
    private String severity;
    private String message;
}