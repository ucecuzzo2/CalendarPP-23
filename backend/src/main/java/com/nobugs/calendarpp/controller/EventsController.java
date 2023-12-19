package com.nobugs.calendarpp.controller;

import com.nobugs.calendarpp.models.Event;
import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.repository.UserRepository;
import com.nobugs.calendarpp.service.EventService;
import com.nobugs.calendarpp.service.UserFromJwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventsController {
    @Autowired
    EventService eventService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserFromJwtService userFromJwtService;

    @PostMapping
    public ResponseEntity<Object> createEvent(@RequestBody Map<String, String> request) {
        try {
            System.out.println(request);
            User user = userFromJwtService.getUserFromJwt();
            if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist!");

            String eventType = request.get("eventType");
            String eventTitle = request.get("eventTitle");
            String eventDescription = request.get("eventDescription");
            LocalDateTime start;
            if(request.get("startTime").isEmpty()){
                start = null;
            } else {
                start = LocalDateTime.parse(request.get("startTime"));
            }
            LocalDateTime end;
            if(request.get("endTime").isEmpty()){
                end = null;
            } else {
                end = LocalDateTime.parse(request.get("endTime"));
            }

            return new ResponseEntity<>(eventService.createEvent(user, eventType, eventTitle, eventDescription, start, end), HttpStatus.CREATED);
        } catch (ResponseStatusException e){
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        } catch (DateTimeParseException e){
            return new ResponseEntity<>("Invalid date time", HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>("Invalid data", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<Event>> getUserEvents(){
        User user = userFromJwtService.getUserFromJwt();

        if (user != null) {
            return new ResponseEntity<>(eventService.getUserEvents(user.getId()), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping ("/{eventId}")
    public ResponseEntity<Object> getEvent(@PathVariable Long eventId) {
        try {
            User user = userFromJwtService.getUserFromJwt();
            if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist!");

            return new ResponseEntity<>(eventService.getEvent(user, eventId), HttpStatus.OK);
        } catch (ResponseStatusException e){
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }

    @DeleteMapping ("/{eventId}")
    public ResponseEntity<Object> deleteEvent(@PathVariable Long eventId) {
        try {
            User user = userFromJwtService.getUserFromJwt();
            if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist!");

            return new ResponseEntity<>(eventService.deleteEvent(user, eventId), HttpStatus.OK);
        } catch (ResponseStatusException e){
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }


    @PutMapping ("/{eventId}")
    public ResponseEntity<Object> updateEvent(@RequestBody Map<String, String> request,
                                             @PathVariable Long eventId) {
        try {
            User user = userFromJwtService.getUserFromJwt();
            if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist!");

            String eventType = request.get("eventType");
            String eventTitle = request.get("eventTitle");
            String eventDescription = request.get("eventDescription");
            LocalDateTime start;
            if(request.get("startTime") != null){
                start = LocalDateTime.parse(request.get("startTime"));
            } else {
                start = null;
            }
            LocalDateTime end;
            if(request.get("endTime") != null){
                end = LocalDateTime.parse(request.get("endTime"));
            } else {
                end = null;
            }
            return new ResponseEntity<>(eventService.updateEvent(user, eventId, eventType, eventTitle, eventDescription, start, end), HttpStatus.OK);

        } catch (ResponseStatusException e){
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        } catch (DateTimeParseException e){
            return new ResponseEntity<>("Invalid date time", HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>("Invalid data", HttpStatus.BAD_REQUEST);
        }
    }
}