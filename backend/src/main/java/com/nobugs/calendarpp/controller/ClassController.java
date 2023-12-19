package com.nobugs.calendarpp.controller;
import com.nobugs.calendarpp.models.Class;
import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.service.ClassService;
import com.nobugs.calendarpp.service.UserFromJwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/classes")
public class ClassController {
    @Autowired
    private ClassService classService;

    @Autowired
    private UserFromJwtService userFromJwtService;

    @GetMapping
    public ResponseEntity<Object> getAllClasses(){
        try {
            return new ResponseEntity<>(classService.getAllClasses(), HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(null, e.getStatusCode());
        }
    }

    @GetMapping("/{classId}")
    public ResponseEntity<Object> getClass(@PathVariable Long classId){
        try {
            return new ResponseEntity<>(classService.getClassById(classId), HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(null, e.getStatusCode());
        }
    }

    // Build and Create Class REST API
    @PostMapping
    public ResponseEntity<Object> createClass(@RequestBody Map<String, String> request) {
        try {
            User user = userFromJwtService.getUserFromJwt();
            if(!user.getRole().equals("ADMIN")) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Only admins can create new schools");

            Class createdClass = classService.createClass(request.get("name"),request.get("semester"),request.get("canvasId"),Long.parseLong(request.get("schoolId")));
            return new ResponseEntity<>(createdClass, HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{classId}")
    public ResponseEntity<Object> deleteSchool(@PathVariable Long classId){
        try {
            User user = userFromJwtService.getUserFromJwt();
            if(!user.getRole().equals("ADMIN")) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Only admins can delete classes");
            classService.deleteClass(classId);
            return new ResponseEntity<>("Class deleted",HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }
}