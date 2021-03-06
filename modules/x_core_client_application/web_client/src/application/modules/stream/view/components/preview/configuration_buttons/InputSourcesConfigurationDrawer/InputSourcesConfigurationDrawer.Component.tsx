import { Bind } from "dreamstate";
import * as React from "react";
import { ChangeEvent, Component, ReactNode } from "react";

// Lib.
import { Styled } from "@Lib/decorators";
import {
  EDeviceKind,
  getInputDevicesBundled,
  getUserMedia,
  IInputDevicesBundle,
  IInputSourceDevices,
  killStream
} from "@Lib/media";
import { DomVideo } from "@Lib/react_lib/components";
import { Optional } from "@Lib/ts/types";

// Data.
import { streamConfig } from "@Module/stream/data/configs/StreamConfig";

// View.
import {
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SwipeableDrawer,
  Typography,
  WithStyles
} from "@material-ui/core";
import { Check, Close, MusicNote, MusicOff, Refresh } from "@material-ui/icons";
import { inputSourcesConfigurationDrawerStyle } from "./InputSourcesConfigurationDrawer.Style";

// Props.
export interface IInputSourcesConfigurationDrawerState {
  listen: boolean;
  previewStream: Optional<MediaStream>;
  selectedInputSources: IInputSourceDevices;
  audioInputSources: Array<MediaDeviceInfo>;
  videoInputSources: Array<MediaDeviceInfo>;
}

export interface IInputSourcesConfigurationDrawerInjectedProps extends WithStyles<typeof inputSourcesConfigurationDrawerStyle> {}

export interface IInputSourcesConfigurationDrawerOwnProps {
  selectedDevices: IInputSourceDevices;
  show: boolean;
  onHide: () => void;
  onShow: () => void;
  onInputSourcesChange: (sources: IInputSourceDevices) => void;
}

export interface IInputSourcesConfigurationDrawerProps extends IInputSourcesConfigurationDrawerOwnProps, IInputSourcesConfigurationDrawerInjectedProps {}

@Styled(inputSourcesConfigurationDrawerStyle)
export class InputSourcesConfigurationDrawer extends Component<IInputSourcesConfigurationDrawerProps, IInputSourcesConfigurationDrawerState> {

  public readonly state: IInputSourcesConfigurationDrawerState = {
    previewStream: null,

    selectedInputSources: {
      audioInput: null,
      videoInput: null
    },

    listen: false,

    audioInputSources: [],
    videoInputSources: []
  };

  public componentWillReceiveProps(nextProps: IInputSourcesConfigurationDrawerProps): void {

    // Mount.
    if (nextProps.show === true && this.props.show === false) {
      this.onUpdateMediaDevices().then();
    }

    // Unmount.
    if (nextProps.show === false && this.props.show === true) {
      killStream(this.state.previewStream);
      this.setState({ previewStream: null, selectedInputSources: { audioInput: null, videoInput: null } });
    }
  }

  public render(): ReactNode {

    const { classes, show, onHide, onShow } = this.props;
    const { audioInputSources, videoInputSources, selectedInputSources, previewStream, listen } = this.state;

    return (
      <SwipeableDrawer
        anchor={"right"}
        open={show}
        onClose={onHide}
        onOpen={onShow}
      >
        <Grid
          className={classes.root}
          direction={"row"}
          justify={"center"}
          container
        >

          <Grid className={classes.selectionFormHeading} direction={"row"} justify={"space-between"} alignItems={"center"} container>

            <Typography variant={"h6"}> Input Source </Typography>

            <IconButton onClick={onHide}>
              <Close fontSize={"small"}/>
            </IconButton>

          </Grid>

          <Divider/>

          <Grid className={classes.selectionForm} alignItems={"center"} direction={"column"} container>

            {show && <DomVideo className={classes.videoPreview} stream={previewStream} muted={!listen} autoPlay/>}

            {this.renderDevicesSelection(videoInputSources, selectedInputSources.videoInput, "Video Input")}
            {this.renderDevicesSelection(audioInputSources, selectedInputSources.audioInput, "Audio Input")}

            <Grid direction={"row"} container>
              <Button className={classes.actionButton} onClick={this.onToggleListen} variant={"outlined"}>
                {listen ? <MusicNote color="primary" style={{ fontSize: "1.2rem" }}/> : <MusicOff color="primary" style={{ fontSize: "1.2rem" }}/> }
              </Button>

              <Button className={classes.actionButton} onClick={this.onUpdateMediaDevices} variant={"outlined"}>
                <Refresh color="primary" style={{ fontSize: "1.2rem" }}/>
              </Button>

              <Button className={classes.actionButton} onClick={this.onChangesAccept} variant={"outlined"}>
                <Check color="primary" style={{ fontSize: "1.2rem" }}/>
              </Button>
            </Grid>

          </Grid>

          <Divider/>

        </Grid>
      </SwipeableDrawer>
    );
  }

  private renderDevicesSelection(
    devices: Array<MediaDeviceInfo>,
    selected: Optional<MediaDeviceInfo>,
    label: string
  ): ReactNode {

    return (
      <FormControl className={this.props.classes.inputSelectForm}>
        <InputLabel htmlFor="select-multiple">{label}</InputLabel>
        <Select
          value={(selected && selected.deviceId) || -1}
          onChange={(e: ChangeEvent<any>): void => this.handleDeviceSelection(devices.find((it: MediaDeviceInfo) => it.deviceId === e.target.value))}
          input={<Input/>}
        >
          {devices.map((device: MediaDeviceInfo, idx: number) => (
            <MenuItem
              key={device.deviceId}
              value={device.deviceId}
            >
              {device.label || device.kind + idx}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  @Bind()
  private async onUpdateMediaDevices(): Promise<IInputDevicesBundle> {

    const inputSources: IInputDevicesBundle = await getInputDevicesBundled();
    const { selectedDevices } = this.props;
    const { selectedInputSources: { videoInput, audioInput } } = this.state;

    const newState: IInputSourcesConfigurationDrawerState = {
      ...this.state,
      audioInputSources: inputSources.audio,
      selectedInputSources: { ...this.state.selectedInputSources },
      videoInputSources: inputSources.video,
    };

    if (videoInput === null ||
      !inputSources.video.find((videoDevice: MediaDeviceInfo) => videoDevice.deviceId === videoInput.deviceId)) {
      newState.selectedInputSources.videoInput = selectedDevices.videoInput || inputSources.video[0] || null;
    }

    if (audioInput === null ||
      !inputSources.audio.find((audioDevice: MediaDeviceInfo) => audioDevice.deviceId === audioInput.deviceId)) {
      newState.selectedInputSources.audioInput = selectedDevices.audioInput || inputSources.audio[0] || null;
    }

    // Update preview stream, if modal does not have anything selected.

    const { selectedInputSources } = newState;

    if (this.shouldPreviewStreamUpdate(this.state, newState)) {
      this.updatePreviewStream(selectedInputSources.videoInput, selectedInputSources.audioInput)
        .then();
    }

    this.setState(newState);

    return inputSources;
  }

  @Bind()
  private handleDeviceSelection(device: MediaDeviceInfo | undefined): void {

    if (!device) {
      return;
    }

    const newState: IInputSourcesConfigurationDrawerState = { ...this.state, selectedInputSources: { ...this.state.selectedInputSources } };

    switch (device.kind) {

      case EDeviceKind.AUDIO_INPUT:
        newState.selectedInputSources.audioInput = device;
        break;

      case EDeviceKind.VIDEO_INPUT:
        newState.selectedInputSources.videoInput = device;
        break;

    }

    if (this.shouldPreviewStreamUpdate(this.state, newState)) {
      this.updatePreviewStream(newState.selectedInputSources.videoInput, newState.selectedInputSources.audioInput);
    }

    this.setState(newState);
  }

  @Bind()
  private onChangesAccept(): void {

    if (this.state.selectedInputSources.videoInput !== this.props.selectedDevices.videoInput ||
      this.state.selectedInputSources.audioInput !== this.props.selectedDevices.audioInput) {
      this.props.onInputSourcesChange(this.state.selectedInputSources);
    }

  }

  private shouldPreviewStreamUpdate(oldState: IInputSourcesConfigurationDrawerState, newState: IInputSourcesConfigurationDrawerState): boolean {

    const { selectedInputSources: oldSources } = oldState;
    const { selectedInputSources: newSources } = newState;

    return (oldSources.audioInput !== newSources.audioInput || oldSources.videoInput !== newSources.videoInput);
  }

  private async updatePreviewStream(videoDevice: Optional<MediaDeviceInfo>, audioDevice: Optional<MediaDeviceInfo>): Promise<void> {

    const stream: MediaStream = await getUserMedia(streamConfig.getMediaConstraints(videoDevice, audioDevice));

    killStream(this.state.previewStream);

    this.setState({
      previewStream: stream,
      selectedInputSources: {
        audioInput: audioDevice,
        videoInput: videoDevice
      }
    });
  }

  @Bind()
  private onToggleListen(): void {
    this.setState({ listen: !this.state.listen });
  }

}
