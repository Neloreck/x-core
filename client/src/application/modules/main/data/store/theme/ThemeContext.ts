import {ThemeOptions} from "@material-ui/core/styles/createMuiTheme";
import {ReactContextManager} from "@redux-cbd/context";

export interface IThemeContextState {
  themeActions: {};
  themeState: {
    options: ThemeOptions;
  };
}

export class ThemeContext extends ReactContextManager<IThemeContextState> {

  protected state: IThemeContextState = {
    themeActions: {},
    themeState: {
      options: {
        palette: {
          primary: {
            contrastText: "#fff",
            dark: "#0d1e2b",
            light: "#2e85b0",
            main: "#1f5070"
          },
          secondary: {
            contrastText: "#ffffff",
            dark: "#7e7e86",
            light: "#cbd4cc",
            main: "#abafaa"
          },
        },
        typography: {
          useNextVariants: true
        }
      }
    }
  };

}
