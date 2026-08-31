package org.personal.ctmss.config;

import org.personal.ctmss.entity.*;
import org.personal.ctmss.repository.PatientRepository;
import org.personal.ctmss.repository.TrialRepository;
import org.personal.ctmss.repository.TrialSiteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(TrialRepository trialRepository,
                                   TrialSiteRepository trialSiteRepository,
                                   PatientRepository patientRepository) {
        return args -> {
            if (trialRepository.count() == 0) {
                // --- Trials ---
                Trial t1 = new Trial();
                t1.setProtocol_no("AYU-021");
                t1.setTrail_code("AYU-021");
                t1.setTitle("Randomized Trial in Arthritis");
                t1.setShort_title("Arthritis Trial");
                t1.setStudy_phase("Phase II");
                t1.setStudy_type("Interventional");
                t1.setStatus(Status.Active);
                t1.setPrinciple_investigator("Dr. Mehta");
                t1.setSponsor_team("AIIA Research Wing");
                t1.setTarget_patient(300);
                t1.setStart_date(LocalDate.of(2025, 1, 10));
                t1.setExpected_end_date(LocalDate.of(2027, 1, 10));

                Trial t2 = new Trial();
                t2.setProtocol_no("AYU-022");
                t2.setTrail_code("AYU-022");
                t2.setTitle("Ashwagandha in Stress");
                t2.setShort_title("Stress Trial");
                t2.setStudy_phase("Phase III");
                t2.setStudy_type("Observational");
                t2.setStatus(Status.Active);
                t2.setPrinciple_investigator("Dr. Singh");
                t2.setSponsor_team("AIIA Pharma Dept");
                t2.setTarget_patient(150);
                t2.setStart_date(LocalDate.of(2025, 2, 1));
                t2.setExpected_end_date(LocalDate.of(2026, 2, 1));

                Trial t3 = new Trial();
                t3.setProtocol_no("AYU-031");
                t3.setTrail_code("AYU-031");
                t3.setTitle("Protocol for Skin Disorder");
                t3.setShort_title("Skin Trial");
                t3.setStudy_phase("Phase I");
                t3.setStudy_type("Interventional");
                t3.setStatus(Status.Pending);
                t3.setPrinciple_investigator("Dr. Sharma");
                t3.setSponsor_team("AIIA Derma Dept");
                t3.setTarget_patient(50);
                t3.setStart_date(LocalDate.of(2026, 8, 25));

                List<Trial> savedTrials = trialRepository.saveAll(List.of(t1, t2, t3));
                Trial savedT1 = savedTrials.get(0);
                Trial savedT2 = savedTrials.get(1);

                // --- Trial Sites ---
                TrialSite site1 = new TrialSite();
                site1.setTrial(savedT1);
                site1.setSite_name("AIIA Delhi");
                site1.setSite_code("SITE-DL-01");
                site1.setLocation("New Delhi");
                site1.setInvestigator("Dr. Mehta");
                site1.setTarget_patient(200);
                site1.setRecruited_patient(140);
                site1.setSiteStatus(SiteStatus.ACTIVE);

                TrialSite site2 = new TrialSite();
                site2.setTrial(savedT1);
                site2.setSite_name("AIIA Mumbai");
                site2.setSite_code("SITE-MH-01");
                site2.setLocation("Mumbai");
                site2.setInvestigator("Dr. Kapoor");
                site2.setTarget_patient(100);
                site2.setRecruited_patient(70);
                site2.setSiteStatus(SiteStatus.ACTIVE);

                TrialSite site3 = new TrialSite();
                site3.setTrial(savedT2);
                site3.setSite_name("AIIA Bangalore");
                site3.setSite_code("SITE-BLR-01");
                site3.setLocation("Bangalore");
                site3.setInvestigator("Dr. Singh");
                site3.setTarget_patient(150);
                site3.setRecruited_patient(60);
                site3.setSiteStatus(SiteStatus.ACTIVE);

                List<TrialSite> savedSites = trialSiteRepository.saveAll(List.of(site1, site2, site3));
                TrialSite savedSite1 = savedSites.get(0);
                TrialSite savedSite2 = savedSites.get(1);

                // --- Patients ---
                String[] names = {"Rahul Verma", "Priya Nair", "Anil Kumar", "Sunita Sharma", "Rajesh Gupta"};
                String[] genders = {"Male", "Female", "Male", "Female", "Male"};
                int[] ages = {45, 52, 38, 60, 47};
                for (int i = 0; i < 5; i++) {
                    Patient p = new Patient();
                    p.setTrial(savedT1);
                    p.setSite(i < 3 ? savedSite1 : savedSite2);
                    p.setName(names[i]);
                    p.setUhid("UHID-" + (1000 + i));
                    p.setPatient_code("P-" + String.format("%03d", i + 1));
                    p.setAge(ages[i]);
                    p.setGender(genders[i]);
                    p.setRandomization_arm(i % 2 == 0 ? "Arm A" : "Arm B");
                    p.setEnrollment_date(LocalDate.of(2025, 3 + i, 10));
                    p.setStatus(i < 4 ? PatientStatus.ACTIVE : PatientStatus.COMPLETED);
                    p.setConsentStatus(ConsentStatus.GIVEN);
                    p.setConsentDate(LocalDate.of(2025, 3 + i, 5));
                    patientRepository.save(p);
                }

                System.out.println("Mock Data Seeded: Trials, Sites and Patients!");
            }
        };
    }
}
