package com.xcore.application.modules.live.controllers.events;

import com.xcore.application.modules.live.controllers.events.exchange.LayoutBookmarkSetGraphicsRequest;
import com.xcore.application.modules.live.controllers.events.exchange.LiveEventBookmarkResponse;
import com.xcore.application.modules.live.controllers.events.exchange.LayoutBookmarkGraphicsResponse;
import com.xcore.application.modules.live.models.events.LiveEventLayoutBookmark;
import com.xcore.application.modules.live.services.LiveBookmarkService;
import com.xcore.application.modules.live.utils.EventSecurityUtils;
import com.xcore.server.controllers.rest.exchange.ApiResponse;
import com.xcore.server.controllers.rest.exchange.FailedApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/live/bookmarks")
@Slf4j(topic = "[LIVE EVENT CONTROLLER]")
public class LiveEventGraphicsRestController {

  @Autowired
  private LiveBookmarkService liveBookmarkService;

  @GetMapping("/{bookmarkId}")
  public ApiResponse getBookmark(@PathVariable Long bookmarkId) {

    try {

      final LiveEventLayoutBookmark liveEventBookmark = liveBookmarkService.getLayoutBookmark(bookmarkId);

      EventSecurityUtils.checkIfEventBelongsOrThrow(liveEventBookmark.getLiveEvent());

      return new LiveEventBookmarkResponse(liveEventBookmark.getLiveEvent().getId(), liveEventBookmark);
    } catch (Exception ex) {
      return new FailedApiResponse(ex);
    }
  }

  /*
   * Bookmark related graphics.
   */

  @GetMapping("/{bookmarkId}/graphics")
  public ApiResponse getBookmarkGraphics(@PathVariable Long bookmarkId) {

    try {

      final LiveEventLayoutBookmark liveEventBookmark = liveBookmarkService.getLayoutBookmark(bookmarkId);

      EventSecurityUtils.checkIfEventBelongsOrThrow(liveEventBookmark.getLiveEvent());

      return new LayoutBookmarkGraphicsResponse(liveEventBookmark.getLiveEvent().getId(), liveEventBookmark.getId(), liveEventBookmark.getGraphicsObjects());
    } catch (Exception ex) {
      return new FailedApiResponse(ex);
    }
  }

  @PutMapping("/{bookmarkId}/graphics")
  public ApiResponse setGraphicsObjects(@PathVariable Long bookmarkId, @RequestBody LayoutBookmarkSetGraphicsRequest request) {

    try {

      LiveEventLayoutBookmark liveEventBookmark = liveBookmarkService.getLayoutBookmark(bookmarkId);

      EventSecurityUtils.checkIfEventBelongsOrThrow(liveEventBookmark.getLiveEvent());

      liveEventBookmark = liveBookmarkService.updateBookmarkGraphics(liveEventBookmark, request.getObjects());

      return new LayoutBookmarkGraphicsResponse(liveEventBookmark.getLiveEvent().getId(), liveEventBookmark.getId(), liveEventBookmark.getGraphicsObjects());
    } catch (Exception ex) {
      return new FailedApiResponse(ex);
    }
  }

  @PutMapping("/{bookmarkId}/graphics}")
  public ApiResponse addGraphicsObject(@PathVariable Long bookmarkId) {
    return new FailedApiResponse("Implementing.");
  }

}
