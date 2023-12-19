package com.nobugs.calendarpp.service;

import com.nobugs.calendarpp.models.Event;
import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.lang.Long.parseLong;

@Service
public class EventService {

    @Autowired
    EventRepository eventRepository;

    public List<Event> getUserEvents(Long userId){
        return eventRepository.findByUserId(userId);
    }

    public Event getEvent(User user, Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);

        if(eventOpt.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event doesn't exist!");
        }
        Event event = eventOpt.get();

        if(event.getUser().getId()!=user.getId()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Event belongs to someone else!");
        }
        return event;
    }

    public Event createEvent (User user, String eventType, String eventTitle, String eventDescription, LocalDateTime startTime, LocalDateTime endTime) {
        Event newEvent = new Event(eventType,user,startTime,endTime,eventTitle,eventDescription);
        eventRepository.save(newEvent);
        return newEvent;
    }

    public boolean deleteEvent(User user, Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);

        if(eventOpt.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event doesn't exist!");
        }
        Event event = eventOpt.get();

        if(event.getUser().getId()!=user.getId()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Event belongs to someone else!");
        }
        eventRepository.delete(event);
        return true;
    }

    public boolean updateEvent(User user, Long eventId, String eventType, String eventTitle, String eventDescription, LocalDateTime start, LocalDateTime end) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);

        if(eventOpt.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event doesn't exist!");
        }
        Event event = eventOpt.get();

        if(event.getUser().getId()!=user.getId()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Event belongs to someone else!");
        }

        event.setEventType(eventType);
        event.setEventTitle(eventTitle);
        event.setEventDescription(eventDescription);
        event.setStartTime(start);
        event.setEndTime(end);

        eventRepository.save(event);

        return true;
    }


}
