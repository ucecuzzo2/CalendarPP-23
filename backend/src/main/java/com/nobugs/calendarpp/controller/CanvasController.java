package com.nobugs.calendarpp.controller;

import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.service.CanvasService;
import com.nobugs.calendarpp.service.UserFromJwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/canvas")
public class CanvasController {

    @Autowired
    UserFromJwtService userFromJwtService;

    @Autowired
    CanvasService canvasService;

    @GetMapping("/classes/{schoolId}")
    public ResponseEntity<?> getCurrentClasses(@PathVariable long schoolId){
        try {
            User user = userFromJwtService.getUserFromJwt();
            System.out.println(user);
            if(user == null) return new ResponseEntity<>("User does not exist!", HttpStatus.BAD_REQUEST);

            return new ResponseEntity<>(canvasService.getCanvasClasses(user, schoolId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/assignments/{schoolId}")
    public ResponseEntity<?> getAssignments(@PathVariable long schoolId){
        try {
            User user = userFromJwtService.getUserFromJwt();
            if(user == null) return new ResponseEntity<>("User does not exist!", HttpStatus.BAD_REQUEST);

            return new ResponseEntity<>(canvasService.getCanvasAssignments(user, schoolId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
