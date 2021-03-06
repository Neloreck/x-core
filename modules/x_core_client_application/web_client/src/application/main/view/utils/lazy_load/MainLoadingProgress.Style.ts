import { createStyles, Theme } from "@material-ui/core/styles";

export const mainLoadingProgressStyle = (theme: Theme) => createStyles({
  root: {
    backgroundColor: theme.palette.background.default,
    height: "100%",
    width: "100%"
  }
});
