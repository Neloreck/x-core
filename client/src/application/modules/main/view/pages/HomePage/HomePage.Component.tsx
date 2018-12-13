import * as React from "react";
import {Component, ReactNode} from "react";

// Lib.
import {Styled} from "@Lib/react_lib/@material_ui";

// View.
import {HeaderBar, IHeaderBarExternalProps} from "@Main/view/components/HeaderBar";
import {Grid, WithStyles} from "@material-ui/core";
import {homePageStyle} from "./HomePage.Style";

// Props.
export interface IHomePageOwnProps {}

export interface IHomePageExternalProps extends WithStyles<typeof homePageStyle> {}

export interface IHomePageProps extends IHomePageOwnProps, IHomePageExternalProps {}

@Styled(homePageStyle)
export class HomePage extends Component<IHomePageProps> {

  public render(): ReactNode {
    return (
      <Grid className={this.props.classes.root} container>

        <HeaderBar {...{} as IHeaderBarExternalProps}/>

        <div className={this.props.classes.content}>
          Home page
        </div>

      </Grid>
    );
  }

}
