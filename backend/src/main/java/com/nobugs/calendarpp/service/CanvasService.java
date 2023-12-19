package com.nobugs.calendarpp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nobugs.calendarpp.dto.ClassDTO;
import com.nobugs.calendarpp.dto.EventDTO;
import com.nobugs.calendarpp.dto.SchoolDTO;
import com.nobugs.calendarpp.models.CanvasToken;
import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.repository.CanvasTokenRepository;
import com.nobugs.calendarpp.utils.security.EncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class CanvasService {

    @Autowired
    private CanvasTokenRepository canvasTokenRepository;

    @Autowired
    private EncryptionUtil encryptionUtil;

    private ObjectMapper objectMapper;

    public CanvasService() {
        this.objectMapper = new ObjectMapper();
    }

    public List<EventDTO> getCanvasAssignments(User user, long schoolId){
        List<CanvasToken> tokens = canvasTokenRepository.findAllByUserId(user.getId());
        CanvasToken token = tokens.stream()
                .filter(tk -> schoolId == tk.getSchool().getId())
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User does not have token for provided school id!"));

        String decryptedToken;
        try {
            decryptedToken = encryptionUtil.decrypt(token.getToken());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error decrypting token");
        }

        WebClient webClient = WebClient.builder()
                .baseUrl("https://csusm.instructure.com/api/graphql")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + decryptedToken)
                .build();

        String graphqlQuery = "{\"query\":\"query MyQuery { allCourses { name assignmentsConnection { nodes { name dueAt } } } }\"}";

        Mono<String> response = webClient.post()
                .bodyValue(graphqlQuery)
                .retrieve()
                .bodyToMono(String.class);

        // Blocking call to ensure the response is received and processed
        String responseBody;
        try {
            responseBody = response.block();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching canvas classes");
        }

        return classesResponseToDTO(responseBody);
    }

    private List<EventDTO> classesResponseToDTO(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode allCoursesNode = rootNode.path("data").path("allCourses");

            if (!allCoursesNode.isArray()) {
                throw new IOException("Response format is invalid");
            }

            List<EventDTO> upcomingAssignments = new ArrayList<>();


            for (JsonNode courseNode : allCoursesNode) {
                JsonNode assignmentsNode = courseNode.path("assignmentsConnection").path("nodes");

                for (JsonNode assignmentNode : assignmentsNode) {
                    String dueAtText = assignmentNode.path("dueAt").asText();

                    if (dueAtText.equals("null") || dueAtText.isEmpty()) {
                        continue;
                    }

                    ZonedDateTime dueDateTime = ZonedDateTime.parse(dueAtText, DateTimeFormatter.ISO_OFFSET_DATE_TIME);

                    if (ZonedDateTime.now().isBefore(dueDateTime)) {
                        EventDTO eventDTO = new EventDTO();
                        eventDTO.setEventTitle(assignmentNode.path("name").asText());
                        eventDTO.setEventType("Assignment");
                        eventDTO.setEventDescription(courseNode.path("name").asText());
                        eventDTO.setEndTime(dueDateTime.toLocalDateTime());
                        eventDTO.setStartTime(dueDateTime.toLocalDateTime());
                        upcomingAssignments.add(eventDTO);
                    }
                }
            }
            return upcomingAssignments;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error parsing canvas classes response"+e.getMessage());
        }
    }

    public List<ClassDTO> getCanvasClasses(User user, long schoolId) {
        List<CanvasToken> tokens = canvasTokenRepository.findAllByUserId(user.getId());
        CanvasToken token = tokens.stream()
                .filter(tk -> schoolId == tk.getSchool().getId())
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User does not have token for provided school id!"));

        SchoolDTO schoolDTO = new SchoolDTO();
        schoolDTO.setName(token.getSchool().getName());
        schoolDTO.setId(schoolId);

        String decryptedToken;
        try {
            decryptedToken = encryptionUtil.decrypt(token.getToken());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error decrypting token");
        }

        WebClient webClient = WebClient.builder()
                .baseUrl("https://csusm.instructure.com/api/graphql")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + decryptedToken)
                .build();

        String graphqlQuery = "{\"query\":\"query MyQuery { allCourses { id name updatedAt term { name id startAt endAt } } term { name id } }\"}";

        Mono<String> response = webClient.post()
                .bodyValue(graphqlQuery)
                .retrieve()
                .bodyToMono(String.class);

        // Blocking call to ensure the response is received and processed
        String responseBody;
        try {
            responseBody = response.block();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching canvas classes");
        }

        return responseToDTO(responseBody, schoolDTO);
    }

    private List<ClassDTO> responseToDTO(String response, SchoolDTO schoolDTO) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode allCoursesNodes = rootNode.path("data").path("allCourses");

            if (!allCoursesNodes.isArray()) {
                throw new IOException("Response format is invalid");
            }

            return StreamSupport.stream(allCoursesNodes.spliterator(), false)
                    .filter(courseNode -> {
                        // only include current classes
                        JsonNode termNode = courseNode.path("term");
                        String endAtText = termNode.path("endAt").asText();
                        if (endAtText == null || endAtText.isEmpty()) {
                        }
                        ZonedDateTime endDateTime = ZonedDateTime.parse(endAtText, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
                        return ZonedDateTime.now().isBefore(endDateTime); // Only allow courseNodes with endAt in the future
                    })
                    .map(courseNode -> {
                        // map rest of classes to dto
                        ClassDTO classDTO = new ClassDTO();
                        JsonNode termNode = courseNode.path("term");

                        classDTO.setCanvasId(courseNode.path("id").asText());
                        String className = courseNode.path("name").asText();
                        String[] splitted = className.split("\\s+");

                        if (splitted.length >= 4) {
                            classDTO.setName(splitted[2] + " " + splitted[3]);
                        }

                        classDTO.setSemester(termNode.path("name").asText());

                        classDTO.setSchool(schoolDTO);
                        return classDTO;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error parsing canvas classes response");
        }
    }

}
