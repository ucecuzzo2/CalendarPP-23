package com.nobugs.calendarpp.controller;

import com.nobugs.calendarpp.models.Class;
import com.nobugs.calendarpp.models.School;
import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.service.UserFromJwtService;
import com.nobugs.calendarpp.service.UserService;
import com.nobugs.calendarpp.utils.ApiResponse;
import com.nobugs.calendarpp.utils.exceptions.SignupException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserFromJwtService userFromJwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        // check for token in body
        String tokenId = request.getOrDefault("tokenId", null);
        if (tokenId == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "TokenId missing"));
        }
        // check if user already exists
        Optional<User> user = userService.login(tokenId);
        if (user.isEmpty()) {
            // if user doesn't exist prompt towards /signup endpoint
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .body(new ApiResponse(false, "Additional Details Required"));
        }
        return ResponseEntity.ok(new ApiResponse(true, tokenId));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        try{
            User newUser = userService.signup(
                    request.get("tokenId"),
                    request.get("username"),
                    request.get("firstName"),
                    request.get("lastName"),
                    Long.parseLong(request.get("schoolId")));
            if (newUser == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("tokenId", "Provided tokenId is not valid!"));
            }
        } catch (SignupException e) {
            return ResponseEntity.badRequest().body(e.getErrors());
        }

        return ResponseEntity.ok(new ApiResponse(true, request.get("tokenId")));
    }

    @DeleteMapping("/api/users")
    public ResponseEntity<?> deleteUser(@RequestParam(value = "userId") String userId){
        if(userService.deleteUser(userId)){
            return ResponseEntity.ok(userId + " deleted!");
        } else {
            return ResponseEntity.badRequest().body("Unable to delete user");
        }
    }


    // USER-SCHOOL
    @GetMapping("/api/users/me/schools")
    public ResponseEntity<List<School>> getUsersSchools(){
        try {
            User user = userFromJwtService.getUserFromJwt();
            return new ResponseEntity<>(userService.getUsersSchools(user), HttpStatus.OK);
        } catch (ResponseStatusException e){
            return new ResponseEntity<>(null, e.getStatusCode());
        }
    }

    @PostMapping("/api/users/me/schools/{schoolId}")
    public ResponseEntity<String> addUserToSchool(@PathVariable Long schoolId){
        try {
            User user = userFromJwtService.getUserFromJwt();
            userService.addUserToSchool(user, schoolId);
            return new ResponseEntity<>("Student added to the school", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }

    @DeleteMapping("/api/users/me/schools/{schoolId}")
    public ResponseEntity<String> deleteUserFromSchool(@PathVariable Long schoolId) {
        try {
            User user = userFromJwtService.getUserFromJwt();
            userService.deleteUserFromSchool(user, schoolId);
            return new ResponseEntity<>("Student removed from the school", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }

    // USER-CLASS
    @GetMapping("/api/users/me/classes")
    public ResponseEntity<List<Class>> getUsersClasses(){
        try {
            User user = userFromJwtService.getUserFromJwt();
            return new ResponseEntity<>(userService.getUsersClasses(user), HttpStatus.OK);
        } catch (ResponseStatusException e){
            return new ResponseEntity<>(null, e.getStatusCode());
        }
    }

    @PostMapping("/api/users/me/classes/{classId}")
    public ResponseEntity<String> addUserToClass(@PathVariable Long classId){
        try {
            User user = userFromJwtService.getUserFromJwt();
            userService.addUserToClass(user, classId);
            return new ResponseEntity<>("Student added to the class", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }

    @DeleteMapping("/api/users/me/classes/{classId}")
    public ResponseEntity<String> deleteUserFromClass(@PathVariable Long classId) {
        try {
            User user = userFromJwtService.getUserFromJwt();
            if(user == null) return new ResponseEntity<>("User does not exist!", HttpStatus.BAD_REQUEST);

            userService.deleteUserFromClass(user, classId);
            return new ResponseEntity<>("Student removed from the class", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }

    @PostMapping("/api/users/me/canvas")
    public ResponseEntity<String> setCanvasToken(@RequestBody Map<String, String> request){
        try {
            User user = userFromJwtService.getUserFromJwt();
            if(user == null) return new ResponseEntity<>("User does not exist!", HttpStatus.BAD_REQUEST);
            String canvasToken = request.get("canvasToken");
            long schoolId = Long.parseLong(request.get("schoolId"));
            userService.setUserCanvasToken(user, canvasToken, schoolId);
            return new ResponseEntity<>("Canvas token added for user!", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }

    @GetMapping("/api/users/me/canvas")
    public ResponseEntity<Object> getCanvasToken(){
        try {
            User user = userFromJwtService.getUserFromJwt();
            if(user == null) return new ResponseEntity<>("User does not exist!", HttpStatus.BAD_REQUEST);

            return new ResponseEntity<>(userService.getUserCanvasToken(user), HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
