import {WithStyles} from "@material-ui/core";
import {inputSourcePreviewVideoStyle} from "./InputSourcePreviewVideo.Style";

import {IInputSourceDevices} from "@Module/stream/data/store/input_source/store/IInputSourceDevices";

export interface IInputSourcePreviewVideoExternalProps extends WithStyles<typeof inputSourcePreviewVideoStyle> {
}

export interface IInputSourcePreviewVideoOwnProps {
  sources: IInputSourceDevices;
}

export interface IInputSourcePreviewVideoProps extends IInputSourcePreviewVideoOwnProps,
  IInputSourcePreviewVideoExternalProps {
}