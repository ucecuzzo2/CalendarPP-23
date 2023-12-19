package com.nobugs.calendarpp.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@Table(name="schools")
@EqualsAndHashCode(exclude = {"classes", "users"})
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String name;

    @Column(name = "current_semester", length = 50)
    private String currentSemester;

    @Column(name = "canvas_url")
    private String canvasUrl;

    @Column(name = "semester_start")
    private LocalDate semesterStart;

    @Column(name = "semester_end")
    private LocalDate semesterEnd;

    @ManyToMany(mappedBy = "schools")
    @JsonBackReference
    private Set<User> users;

    @OneToMany(mappedBy = "school")
    @JsonManagedReference
    private Set<Class> classes;

    public School(String name, String currentSemester, LocalDate semesterStart, LocalDate semesterEnd){
        this.name = name;
        this.currentSemester = currentSemester;
        this.semesterStart = semesterStart;
        this.semesterEnd = semesterEnd;
    }
}
