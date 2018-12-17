import {EntryPoint} from "@redux-cbd/utils";
import * as React from "react";
import {render} from "react-dom";

import "@Main/view/assets/style/global.scss";
import "typeface-roboto";

/*
 * Modules injector.
 */

import {Router} from "@Application/Router";

@EntryPoint()
export class Application {

  public static main(): void {
    render(<Router/>, document.getElementById("application-root"));
  }

}
