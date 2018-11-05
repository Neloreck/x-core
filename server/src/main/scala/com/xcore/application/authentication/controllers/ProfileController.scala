package com.xcore.application.authentication.controllers

import java.beans.BeanProperty
import java.util.Optional

import com.xcore.application.authentication.models.user.AppUser
import com.xcore.application.authentication.services.AppUserDetailService
import com.xcore.server.controllers.rest.exchange.{ApiResponse, ErrorApiResponse}
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.{HttpStatus, ResponseEntity}
import org.springframework.web.bind.annotation.{GetMapping, PathVariable, RequestMapping, RestController}

@RestController
@RequestMapping(Array("/api/profiles"))
class ProfileController {

  @Autowired
  private var appUserDetailService: AppUserDetailService = _;

  case class ProfileResponse(@BeanProperty profile: AppUser) extends ApiResponse;
  case class ProfileNotFoundResponse(id: Long) extends ErrorApiResponse(s"Profile with id $id was not found.");

  @GetMapping(Array("/{id}"))
  def getAppProfile(@PathVariable(value="id") id: String): ResponseEntity[ApiResponse] = {

    var profileId: Long = 0;

    try {
      profileId = java.lang.Long.parseLong(id);
    } catch {
      case exception: Exception =>
        return new ResponseEntity[ApiResponse](new ErrorApiResponse("Bad profile id supplied: $id."), HttpStatus.BAD_REQUEST);
    }

    val optionalProfile: Optional[AppUser] = appUserDetailService.loadUserById(profileId);

    if (optionalProfile.isPresent) {
      new ResponseEntity[ApiResponse](ProfileResponse(optionalProfile.get()), HttpStatus.OK);
    } else {
      new ResponseEntity[ApiResponse](ProfileNotFoundResponse(profileId), HttpStatus.NOT_FOUND);
    }
  };

}
