package com.xcore.server.controllers.rest.general;

import com.xcore.server.controllers.rest.general.api.ApiInfoResponse;
import com.xcore.server.controllers.rest.general.api.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@Controller
public class GeneralController {

  @RequestMapping("")
  public String handleBaseRoute() {
    return "redirect:/home";
  }

  @ResponseBody
  @RequestMapping("/api")
  public ApiInfoResponse handleApiInfoDetails() {
    return new ApiInfoResponse();
  }

  @ResponseBody
  @RequestMapping("/api/**")
  @ResponseStatus(value = HttpStatus.NOT_FOUND)
  public ErrorResponse handleApiWrongEndpointError() {
    return new ErrorResponse("Failed to find api endpoint.");
  }

  @GetMapping("/error")
  @ResponseStatus(value =  HttpStatus.INTERNAL_SERVER_ERROR)
  public ModelAndView handleError() {
    return new ModelAndView("error");
  }

}