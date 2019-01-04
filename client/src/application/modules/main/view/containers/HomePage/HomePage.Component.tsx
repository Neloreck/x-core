import * as React from "react";
import {Component} from "react";

import {Grid, WithStyles} from "@material-ui/core";

import {Styled} from "@Lib/react_lib/@material_ui";

import {HeaderBar, IHeaderBarExternalProps} from "@Main/view/containers/HeaderBar";

import {homePageStyle} from "./HomePage.Style";

export interface IHomePageOwnProps {}

export interface IHomePageExternalProps extends WithStyles<typeof homePageStyle> {}

export interface IHomePageProps extends IHomePageOwnProps, IHomePageExternalProps {}

@Styled(homePageStyle)
export class HomePage extends Component<IHomePageProps> {

  public render(): JSX.Element {
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