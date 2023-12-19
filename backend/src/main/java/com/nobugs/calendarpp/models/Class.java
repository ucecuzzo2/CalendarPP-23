package com.nobugs.calendarpp.models;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.Set;


@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "classes")
@EqualsAndHashCode(exclude = {"school", "users"})
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Class {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String semester;

    @ManyToOne
    @JoinColumn(name = "school_id")
    @JsonBackReference
    private School school;

    @Column(name = "canvas_id")
    private String canvasId;

    @ManyToMany(mappedBy = "classes")
    @JsonBackReference
    private Set<User> users;



    public Class(String name, String semester, String canvas, School school) {
        this.name = name;
        this.semester = semester;
        this.canvasId = canvas;
        this.users = new HashSet<>();
        this.school = school;

    }
}
