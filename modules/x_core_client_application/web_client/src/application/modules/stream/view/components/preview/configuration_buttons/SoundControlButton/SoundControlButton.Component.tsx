import { Bind, Consume } from "dreamstate";
import * as React from "react";
import { PureComponent, ReactNode } from "react";

// Lib.
import { Styled } from "@Lib/decorators";

// Data.
import {
  ISourceContext,
  sourceContextManager
} from "@Module/stream/data/store";

// View.
import { Fab, Tooltip, WithStyles } from "@material-ui/core";
import { MusicNote, MusicOff } from "@material-ui/icons";
import { soundControlButtonStyle } from "./SoundControlButton.Style";

// Props.
export interface ISoundControlButtonInjectedProps extends WithStyles<typeof soundControlButtonStyle>, ISourceContext {}
export interface ISoundControlButtonOwnProps {}
export interface ISoundControlButtonProps extends ISoundControlButtonOwnProps, ISoundControlButtonInjectedProps {}

@Consume(sourceContextManager)
@Styled(soundControlButtonStyle)
export class SoundControlButton extends PureComponent<ISoundControlButtonProps> {

  public render(): ReactNode {

    const { classes, sourceState: { captureAudio } } = this.props;

    return (
        <Tooltip title={"Toggle sound capturing."} placement={"top"}>
          <Fab className={classes.root} onClick={this.onToggleAudio} color={"primary"}>
            { captureAudio ? <MusicNote/> : <MusicOff/> }
          </Fab>
        </Tooltip>
    );
  }

  @Bind()
  private onToggleAudio(): void {

    const { sourceActions: { setAudioCapturing }, sourceState: { captureAudio } } = this.props;

    setAudioCapturing(!captureAudio);
  }

}
