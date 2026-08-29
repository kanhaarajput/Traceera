package org.personal.ctmss.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class AdverseEventRequest {
    private UUID patientId;
    private String description;
    private String severity;
    private LocalDate reportedDate;
}