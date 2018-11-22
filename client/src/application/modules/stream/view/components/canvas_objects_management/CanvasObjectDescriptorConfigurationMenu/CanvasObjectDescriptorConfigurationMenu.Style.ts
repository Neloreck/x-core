import {createStyles, Theme} from "@material-ui/core/styles";

export const canvasObjectDescriptorConfigurationMenuStyle = (theme: Theme) => createStyles({
  root: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: theme.spacing.unit,
    height: "100%",
    minWidth: theme.spacing.unit * 33,
    overflowY: "auto",
    padding: theme.spacing.unit * 2,
  }
});
