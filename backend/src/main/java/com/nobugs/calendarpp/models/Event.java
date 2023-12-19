package com.nobugs.calendarpp.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    Long id;

    @Column(name = "event_title")
    String eventTitle;

    @Column(name = "event_description")
    String eventDescription;

    @Column(name ="event_type")
    String eventType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    User user;

    @Column(name="start_time")
    LocalDateTime startTime;

    @Column(name="end_time")
    LocalDateTime endTime;

    public Event(String event_type, User user, LocalDateTime start_time, LocalDateTime end_time, String event_title, String event_description) {
        this.eventType = event_type;
        this.user = user;
        this.startTime = start_time;
        this.endTime = end_time;
        this.eventTitle = event_title;
        this.eventDescription = event_description;
    }

}
