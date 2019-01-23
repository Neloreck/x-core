package com.xcore.application.modules.authentication;

import com.xcore.application.modules.authentication.configs.WebSecurityOptions;
import com.xcore.server.XCoreServer;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebAppConfiguration
@SpringBootTest(classes = {XCoreServer.class})
@ActiveProfiles(profiles = {"testing"})
public class OAuthMvcTest {

  @Autowired
  private WebApplicationContext wac;

  @Autowired
  private FilterChainProxy springSecurityFilterChain;

  @Autowired
  private WebSecurityOptions webSecurityOptions;

  private MockMvc mockMvc;

  @Before
  public void initialize() {
    this.mockMvc = MockMvcBuilders
      .webAppContextSetup(this.wac)
      .addFilter(springSecurityFilterChain)
      .build();
  }

  @Test
  public void testAccessTokensForDefaultUsers() throws Exception {

    String adminToken = obtainAccessToken("admin", "admin");
    String moderatorToken = obtainAccessToken("moderator", "moderator");

  }

  private String obtainAccessToken(final String username, final String password) throws Exception {

    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();

    params.add("client_id", webSecurityOptions.CLIENT_APPLICATION_ID());
    params.add("grant_type", "password");
    params.add("username", username);
    params.add("password", password);

    ResultActions result = mockMvc
      .perform(post("/auth/token")
      .params(params)
      .with(httpBasic(webSecurityOptions.CLIENT_APPLICATION_ID(), webSecurityOptions.CLIENT_APPLICATION_SECRET()))
      .accept("application/json;charset=UTF-8"))
      .andExpect(status().isOk())
      .andExpect(content().contentType("application/json;charset=UTF-8"));

    String resultString = result.andReturn().getResponse().getContentAsString();
    JacksonJsonParser jsonParser = new JacksonJsonParser();

    return jsonParser
        .parseMap(resultString)
        .get("access_token")
        .toString();
  }



}