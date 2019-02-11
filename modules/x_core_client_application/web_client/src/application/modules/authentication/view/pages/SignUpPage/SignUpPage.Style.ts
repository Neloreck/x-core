import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";

import backgroundImage from "@Module/home/view/assets/images/main-background.jpg";

export const signUpPageStyle = (theme: Theme) => createStyles({
  content: {
    background: `url(${backgroundImage}) no-repeat center center fixed`,
    backgroundSize: "cover",
    flexGrow: 24,
    width: "100%"
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    height: "100%",
    width: "100%"
  }
});
