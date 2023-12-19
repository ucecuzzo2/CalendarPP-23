package com.nobugs.calendarpp.service;

import com.nobugs.calendarpp.dto.CanvasTokenDTO;
import com.nobugs.calendarpp.models.CanvasToken;
import com.nobugs.calendarpp.models.Class;
import com.nobugs.calendarpp.models.School;
import com.nobugs.calendarpp.repository.CanvasTokenRepository;
import com.nobugs.calendarpp.repository.ClassRepository;
import com.nobugs.calendarpp.repository.SchoolRepository;
import com.nobugs.calendarpp.repository.UserRepository;
import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.utils.InputValidation;
import com.nobugs.calendarpp.utils.dto.EntityToDto;
import com.nobugs.calendarpp.utils.exceptions.SignupException;
import com.nobugs.calendarpp.utils.security.EncryptionUtil;
import com.nobugs.calendarpp.utils.security.GoogleTokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    GoogleTokenUtils googleTokenUtils;

    @Autowired
    UserFromJwtService userFromJwt;

    @Autowired
    SchoolRepository schoolRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private CanvasTokenRepository canvasTokenRepository;

    @Autowired
    private EncryptionUtil encryptionUtil;

    public Optional<User> login(String tokenId) {
        GoogleTokenUtils.GoogleUserDetails userDetails;
        try {
            userDetails = googleTokenUtils.validateAndExtractDetails(tokenId);
        } catch (Exception e) {
            // handle and log the exception as needed
            return Optional.empty();
        }
        return Optional.ofNullable(userRepository.findByEmail(userDetails.getEmail()));
    }

    public User signup(String tokenId, String username, String firstName, String lastName, Long schoolId) throws SignupException {
        GoogleTokenUtils.GoogleUserDetails userDetails;
        HashMap<String,String> errors = new HashMap<>();
        try {
            userDetails = googleTokenUtils.validateAndExtractDetails(tokenId);
        } catch (Exception e) {
            // handle and log the exception as needed
            return null;
        }
        if(userRepository.findByEmail(userDetails.getEmail())!=null) errors.put("user","User already exists with email!");
        if(!InputValidation.validateName(firstName)) errors.put("firstName",firstName + " is not a valid name!");
        if(!InputValidation.validateName(lastName)) errors.put("lastName",lastName + " is not a valid name!");
        if(!InputValidation.validateUsername(username)) errors.put("username",username + " must be between 4-20 characters, start with a letter, and not container special characters except _");
        if(userRepository.existsByUsername(username)) errors.put("username", username + " is already taken!");
        if(!errors.isEmpty()) throw new SignupException(errors);

        School school = schoolRepository.findById(schoolId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "School not found"));

        User user = new User();
        user.setEmail(userDetails.getEmail());
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole("USER");
        user.setUsername(username);
        user.getSchools().add(school);
        school.getUsers().add(user);
        userRepository.save(user);
        return user;
    }

    public boolean deleteUser(String userId) {
        User user = userFromJwt.getUserFromJwt();
        if(String.valueOf(user.getId()).equals(userId) || user.getRole().equals("ADMIN")){
            userRepository.deleteById(Long.parseLong(userId));
            return true;
        }

        return false;
    }

    // USER-SCHOOL
    public List<School> getUsersSchools(User user) {
        List<School> schools = schoolRepository.findByUsers(user);

        return schools;
    }

    public boolean addUserToSchool(User user, long schoolId) {
        School school = schoolRepository.findById(schoolId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "School not found"));

        boolean alreadyExists = school.getUsers().stream().anyMatch(existingUser -> existingUser.getId()==user.getId());
        if (alreadyExists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already exists in the school");
        }
        school.getUsers().add(user);
        user.getSchools().add(school);
        schoolRepository.save(school);

        return true;
    }

    public boolean deleteUserFromSchool(User user, long schoolId) {
        // Retrieve the class with given ID
        School school = schoolRepository.findById(schoolId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "School not found"));
        // Check if the user is owner of the class by checking class getID

        boolean alreadyExists = school.getUsers().stream().anyMatch(existingUser -> existingUser.getId()==user.getId());
        if (!alreadyExists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not in the school");
        }

        // Remove the user from the class
        school.getUsers().remove(user);
        // Remove the class from the user's list of classes
        user.getSchools().remove(school);

        // Save the changes
        schoolRepository.save(school);

        return true;
    }

    // USER-CLASS
    public List<Class> getUsersClasses(User user) {
        List<Class> classes = classRepository.findByUsers(user);

        return classes;
    }

    public boolean addUserToClass(User user, Long classId){
        Class c = classRepository.findById(classId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class not found"));

        boolean alreadyExists = c.getUsers().stream().anyMatch(existingUser -> existingUser.getId()==user.getId());
        if (alreadyExists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already exists in the class");
        }

        c.getUsers().add(user);
        user.getClasses().add(c);
        classRepository.save(c);

        return true;
    }

    //Delete a class by classID
    public boolean deleteUserFromClass(User user, Long classId) {
        // Retrieve the class with given ID
        Class c = classRepository.findById(classId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class not found"));
        // Check if the user is owner of the class by checking class getID

        boolean alreadyExists = c.getUsers().stream().anyMatch(existingUser -> existingUser.getId()==user.getId());
        if (!alreadyExists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not in the class");
        }

        // Remove the user from the class
        c.getUsers().remove(user);
        // Remove the class from the user's list of classes
        user.getClasses().remove(c);

        // Save the changes
        classRepository.save(c);

        return true;
    }

    @Transactional
    public void setUserCanvasToken(User user, String canvasToken, Long schoolId) {
        Optional<School> schoolOpt = schoolRepository.findById(schoolId);

        if(schoolOpt.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "School not found by id!");
        }

        List<CanvasToken> tokens = canvasTokenRepository.findAllByUserId(user.getId());

        School school = schoolOpt.get();

        // only allow 1 token per school
        for(CanvasToken ct: tokens){
            if(ct.getSchool().getId() == school.getId()){
                canvasTokenRepository.deleteBySchoolId(school.getId());
            }
        }

        // test token
        WebClient webClient = WebClient.builder()
                .baseUrl(school.getCanvasUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + canvasToken)
                .build();

        String testQuery = "{\"query\":\"query TestQuery {allCourses {name}\"}";

        Mono<String> response = webClient.post()
                .bodyValue(testQuery)
                .retrieve()
                .bodyToMono(String.class);

        try {
            response.block();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error validating token");
        }

        String encryptedToken;
        try {
            encryptedToken = encryptionUtil.encrypt(canvasToken);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Token encryption failed!");
        }

        CanvasToken ct = new CanvasToken(encryptedToken, school, user.getId());
        canvasTokenRepository.save(ct);
    }

    public List<CanvasTokenDTO> getUserCanvasToken(User user) throws Exception {
        List<CanvasToken> tokens = canvasTokenRepository.findAllByUserId(user.getId());
        for(CanvasToken canvasToken: tokens){
            String encryptedToken = canvasToken.getToken();
            canvasToken.setToken(encryptionUtil.decrypt(encryptedToken));
        }
        return tokens.stream().map(EntityToDto::toTokenDTO).collect(Collectors.toList());
    }
}
