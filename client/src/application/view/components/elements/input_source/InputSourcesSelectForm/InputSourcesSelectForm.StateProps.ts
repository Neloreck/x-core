import {IInputSourceDevices} from "@Store/input_source/store/IInputSourceDevices";

import {WithStyles} from "@material-ui/core";
import {inputSourcesSelectFormStyle} from "./InputSourcesSelectForm.Style";

export interface IInputSourcesSelectFormExternalProps extends WithStyles<typeof inputSourcesSelectFormStyle> {
}

export interface IInputSourcesSelectFormOwnProps {
  onInputSourcesChange: (sources: IInputSourceDevices) => void;
}

export interface IInputSourcesSelectFormProps extends IInputSourcesSelectFormOwnProps, IInputSourcesSelectFormExternalProps {
}
