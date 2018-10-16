import {createStyles, Theme} from "@material-ui/core/styles";

export const canvasObjectAdditionManagerStyle = (theme: Theme) => createStyles({
  addObjectTooltip: {
    height: theme.spacing.unit * 5,
    margin: theme.spacing.unit * 2,
    width: theme.spacing.unit * 5,
  },
  root: {
    alignSelf: "flex-start",
    left: 0,
    position: "absolute",
    top: theme.spacing.unit * 13
  },
  rootEmpty: {
    alignSelf: "flex-start",
    left: 0,
    position: "absolute",
    top: theme.spacing.unit * 13,
    width: 0
  }
});
