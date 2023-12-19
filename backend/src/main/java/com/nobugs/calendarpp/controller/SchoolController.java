package com.nobugs.calendarpp.controller;

import com.nobugs.calendarpp.dto.SchoolDTO;
import com.nobugs.calendarpp.models.Class;
import com.nobugs.calendarpp.models.School;
import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.service.SchoolService;
//import org.apache.http.HttpStatus;
import com.nobugs.calendarpp.service.UserFromJwtService;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/schools")
public class SchoolController {
    @Autowired
    private SchoolService schoolService;

    @Autowired
    private UserFromJwtService userFromJwtService;



    @PostMapping("/new")
    public ResponseEntity<Object> createSchool(@RequestBody Map<String, String> request){
        try {
            User user = userFromJwtService.getUserFromJwt();
            if(!user.getRole().equals("ADMIN")) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Only admins can create new schools");
            String name = request.get("name");
            String semester = request.get("currentSemester");
            LocalDate semesterStart = LocalDate.parse(request.get("semesterStart"));
            LocalDate semesterEnd = LocalDate.parse(request.get("semesterEnd"));
            return new ResponseEntity<>(schoolService.createSchool(name, semester, semesterStart, semesterEnd),HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }

    @GetMapping
    public ResponseEntity<List<SchoolDTO>> getAllSchools(){
        try {
            return new ResponseEntity<>(schoolService.getAllSchools(), HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(null, e.getStatusCode());
        }
    }

    @GetMapping("/{schoolId}")
    public ResponseEntity<School> getSchool(@PathVariable Long schoolId){
        try {
            return new ResponseEntity<>(schoolService.getSchool(schoolId), HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(null, e.getStatusCode());
        }
    }

    @GetMapping("/classes/{schoolId}")
    public ResponseEntity<Object> getSchoolsClasses(@PathVariable Long schoolId){
        try {
            return new ResponseEntity<>(schoolService.getSchoolsClasses(schoolId), HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }

    @DeleteMapping("/{schoolId}")
    public ResponseEntity<Object> deleteSchool(@PathVariable Long schoolId){
        try {
            User user = userFromJwtService.getUserFromJwt();
            if(!user.getRole().equals("ADMIN")) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Only admins can delete schools");
            schoolService.deleteSchool(schoolId);
            return new ResponseEntity<>("School deleted",HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }
}
