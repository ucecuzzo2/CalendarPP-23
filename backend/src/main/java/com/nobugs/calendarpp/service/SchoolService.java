package com.nobugs.calendarpp.service;

import com.nobugs.calendarpp.dto.SchoolDTO;
import com.nobugs.calendarpp.models.Class;
import com.nobugs.calendarpp.models.School;
import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.repository.ClassRepository;
import com.nobugs.calendarpp.repository.SchoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SchoolService {
    @Autowired
    SchoolRepository schoolRepository;

    @Autowired
    private ClassRepository classRepository;

    public School createSchool(String name, String semester, LocalDate semesterStart, LocalDate semesterEnd){
        try {
            School newSchool = new School(name, semester, semesterStart, semesterEnd);
            return schoolRepository.save(newSchool);
        } catch(Exception e) {
            return null;
        }
    }

    public School getSchool(Long schoolId) {
        Optional<School> school = schoolRepository.findById(schoolId);

        if(school.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "School doesn't exist!");
        }

        return school.get();
    }

    public List<SchoolDTO> getAllSchools() {
        List<SchoolDTO> schools = schoolRepository.findAll().stream().map(s -> new SchoolDTO(s.getId(),s.getName())).collect(Collectors.toList());
        return schools;
    }

    public List<Class> getSchoolsClasses(Long schoolId) {
        Optional<School> school = schoolRepository.findById(schoolId);

        if(school.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "School doesn't exist!");
        }

        return classRepository.findBySchoolId(schoolId);
    }

    public void deleteSchool(Long schoolId) {
        Optional<School> school = schoolRepository.findById(schoolId);

        if(school.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "School doesn't exist!");
        }

        schoolRepository.delete(school.get());
    }
}
