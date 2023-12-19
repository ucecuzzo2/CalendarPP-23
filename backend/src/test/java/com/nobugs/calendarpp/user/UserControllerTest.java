package com.nobugs.calendarpp.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nobugs.calendarpp.controller.UserController;
import com.nobugs.calendarpp.models.School;
import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.service.UserFromJwtService;
import com.nobugs.calendarpp.service.UserService;
import com.nobugs.calendarpp.utils.exceptions.SignupException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserFromJwtService userFromJwtService;

    @Test
    public void testSignupSuccess() throws Exception {
        Map<String, String> requestBody = Map.of(
                "tokenId", "someTokenId",
                "username", "testUser",
                "firstName", "John",
                "lastName", "Doe",
                "schoolId", "1"
        );

        User mockUser = new User();
        given(userService.signup(anyString(), anyString(), anyString(), anyString(), anyLong())).willReturn(mockUser);

        mockMvc.perform(post("/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    public void testSignupBadTokenFailure() throws Exception {
        Map<String, String> requestBody = Map.of(
                "tokenId", "someTokenId",
                "username", "testUser",
                "firstName", "John",
                "lastName", "Doe",
                "schoolId", "1"
        );
        given(userService.signup(anyString(), anyString(), anyString(), anyString(), anyLong())).willReturn(null);

        mockMvc.perform(post("/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(requestBody)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testGetUsersSchools() throws Exception {
        User mockUser = new User();
        List<School> schools = Arrays.asList(new School(), new School());
        given(userFromJwtService.getUserFromJwt()).willReturn(mockUser);
        given(userService.getUsersSchools(mockUser)).willReturn(schools);

        mockMvc.perform(get("/api/users/me/schools")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(schools.size())));
    }
}
