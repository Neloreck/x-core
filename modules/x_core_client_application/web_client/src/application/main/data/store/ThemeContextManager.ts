import { Bind, ContextManager } from "dreamstate";

import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

export interface IThemeContext {
  themeActions: {
    isDark: () => boolean;
    setDark: (isDark: boolean) => void;
  };
  themeState: {
    options: ThemeOptions;
  };
}

export class ThemeContextManager extends ContextManager<IThemeContext> {

  protected context: IThemeContext = {
    themeActions: {
      isDark: this.isDark,
      setDark: this.setDark
    },
    themeState: {
      options: {
        palette: {
          primary: {
            contrastText: "#ffffff",
            dark: "#324e76",
            light: "#447fc9",
            main: "#285e8e"
          },
          secondary: {
            contrastText: "#000000",
            dark: "#5a5a5a",
            light: "#dbdbdb",
            main: "#919191"
          },
          type: "dark"
        },
        typography: {
          useNextVariants: true
        }
      }
    }
  };

  // Getters.

  @Bind()
  public isDark(): boolean {
    return (this.context.themeState.options.palette as PaletteOptions).type === "dark";
  }

  // Actions.

  @Bind()
  public setDark(isDark: boolean): void {

    this.context.themeState = Object.assign({}, this.context.themeState);

    (this.context.themeState.options.palette as PaletteOptions).type = isDark ? "dark" : "light";

    this.update();
  }

}
