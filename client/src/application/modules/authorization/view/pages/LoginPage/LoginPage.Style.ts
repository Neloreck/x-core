import {createStyles, Theme} from "@material-ui/core/styles";

export const loginPageStyle = (theme: Theme) => createStyles({
  content: {
    flexGrow: 24,
    width: "100%"
  },
  root: {
    backgroundColor: theme.palette.background.paper
  }
});
