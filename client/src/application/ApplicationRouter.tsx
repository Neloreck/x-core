import {Consume, Provide} from "@redux-cbd/context";
import {Wrapped} from "@redux-cbd/utils";
import * as React from "react";
import {PureComponent} from "react";
import {Route, Router} from "react-router";
import {Switch} from "react-router-dom";

// Lib.
import {lazyLoadComponentFactory} from "@Lib/react_lib/lazy_load";

// Data.
import {authContextManager, IRouterContext, routerContextManager, themeContextManager} from "@Main/data/store";

// View.
import {GlobalThemeProvider, IGlobalThemeProviderProps} from "@Main/view/layouts/GlobalThemeProvider";

// Submodules.
export const MainModule = lazyLoadComponentFactory.getComponent(() => import(/* webpackChunkName: "module@main" */"@Module/main"));
export const StreamModule = lazyLoadComponentFactory.getComponent(() => import(/* webpackChunkName: "module@stream" */"@Module/stream"));

// Props.
export interface IApplicationRouterProps extends IRouterContext, IGlobalThemeProviderProps {}

/* Global store provision. */
@Provide(authContextManager)
@Provide(routerContextManager)
@Provide(themeContextManager)
/* Sync router store with router and context with theme provision. */
@Consume<IRouterContext, IApplicationRouterProps>(routerContextManager)
@Wrapped<IGlobalThemeProviderProps, IApplicationRouterProps>(GlobalThemeProvider)
export class ApplicationRouter extends PureComponent<IApplicationRouterProps> {

  public render(): JSX.Element {
    const {routingState: {history}} = this.props;

    return (
      <Router history={history}>

        <Switch>

          <Route exact={true} path={"/stream*"} component={StreamModule}/>
          <Route component={MainModule}/>

        </Switch>

      </Router>
    );
  }

}
