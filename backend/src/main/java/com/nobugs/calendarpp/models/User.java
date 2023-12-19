package com.nobugs.calendarpp.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@Table(name = "users")
@Data
@EqualsAndHashCode(exclude = {"schools", "classes"})
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    long id;

    @Column(name="first_name")
    String firstName;

    @Column(name="last_name")
    String lastName;

    @Column(name="email")
    String email;

    @Column(name="access_token")
    String access_token;

    @Column(name="refresh_token")
    String refresh_token;

    @Column(name="canvas_token")
    String canvas_token;

    @Column(name="username")
    String username;

    @Column(name = "role")
    String role;

    @ManyToMany
    @JoinTable(
            name="users_school",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "school_id")
    )
    @JsonManagedReference
    Set<School> schools = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name="users_class",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "class_id")
    )
    @JsonManagedReference
    Set<Class> classes = new HashSet<>();

    public void addClass(Class classToAdd){
        this.classes.add(classToAdd);
        classToAdd.getUsers().add(this);
    }
}
