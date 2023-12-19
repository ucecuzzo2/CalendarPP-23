package com.nobugs.calendarpp.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventDTO {
    private String eventTitle;
    private String eventType;
    private String eventDescription;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
