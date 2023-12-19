package com.nobugs.calendarpp.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@Table(name = "canvas_tokens")
@NoArgsConstructor
public class CanvasToken {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    long id;

    @Column(name = "token")
    String token;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "school_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    School school;

    @Column(name = "user_id")
    long userId;

    public CanvasToken(String token, School school, long userId){
        this.token = token;
        this.school = school;
        this.userId = userId;
    }
}
