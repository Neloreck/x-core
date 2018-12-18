import {Consume} from "@redux-cbd/context";
import {Bind} from "@redux-cbd/utils";
import * as React from "react";
import {PureComponent, ReactNode} from "react";

// Lib.
import {Styled} from "@Lib/react_lib/mui";

// Data.
import {graphicsContextManager, IGraphicsContext} from "@Module/stream/data/store";

// View.
import {Fab, Grid, Tooltip, WithStyles} from "@material-ui/core";
import {Videocam, VideocamOff} from "@material-ui/icons";
import {videoControlButtonStyle} from "./VideoControlButton.Style";

// Props.

export interface IVideoControlButtonExternalProps extends WithStyles<typeof videoControlButtonStyle>, IGraphicsContext {}
export interface IVideoControlButtonOwnProps {}
export interface IVideoControlButtonProps extends IVideoControlButtonOwnProps, IVideoControlButtonExternalProps {}

@Consume<IGraphicsContext, IVideoControlButtonProps>(graphicsContextManager)
@Styled(videoControlButtonStyle)
export class VideoControlButton extends PureComponent<IVideoControlButtonProps> {

  public render(): ReactNode {

    const {classes, graphicsState: {showMainVideo}} = this.props;

    return (
      <Tooltip title={"Toggle video capturing."} placement={"right"}>
        <Fab className={classes.root} onClick={this.onToggleAudio} color={"primary"}>
          { showMainVideo ? <Videocam/> : <VideocamOff/> }
        </Fab>
      </Tooltip>
    );
  }

  @Bind()
  private onToggleAudio(): void {

    const {graphicsActions: {setMainVideoDisplay}, graphicsState: {showMainVideo}} = this.props;

    setMainVideoDisplay(!showMainVideo);
  }

}
