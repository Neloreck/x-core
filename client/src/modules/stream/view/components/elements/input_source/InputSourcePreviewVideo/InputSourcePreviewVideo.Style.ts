import {createStyles, Theme} from "@material-ui/core/styles";

export const inputSourcePreviewVideoStyle = (theme: Theme) => createStyles({
  root: {
    backgroundColor: "#000",
    boxSizing: "border-box",
    flexBasis: "20rem",
    flexGrow: 1,
    height: "100%",
    overflow: "hidden",
    width: "100%"
  }
});