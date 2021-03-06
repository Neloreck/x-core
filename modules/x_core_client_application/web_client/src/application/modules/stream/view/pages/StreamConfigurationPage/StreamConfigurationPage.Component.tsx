import * as React from "react";
import { Component, ReactNode } from "react";

// Lib.
import { Styled } from "@Lib/decorators";

// Data.

// View.
import { Fade, Grid, WithStyles } from "@material-ui/core";
import {
  IStreamingHeaderBarInjectedProps,
  StreamingHeaderBar
} from "@Module/stream/view/components/heading/StreamingHeaderBar";
import { streamConfigurationPageStyle } from "./StreamConfigurationPage.Style";

// Props.
export interface IStreamConfigurationPageState {
  mounted: boolean;
}

export interface IStreamConfigurationPageInjectedProps extends WithStyles<typeof streamConfigurationPageStyle> {}
export interface IStreamConfigurationPageOwnProps {}
export interface IStreamConfigurationPageProps extends IStreamConfigurationPageOwnProps, IStreamConfigurationPageInjectedProps {}

@Styled(streamConfigurationPageStyle)
export class StreamConfigurationPage extends Component<IStreamConfigurationPageProps, IStreamConfigurationPageState> {

  public state: IStreamConfigurationPageState = {
    mounted: true
  };

  public componentDidMount(): void {
    this.setState({ mounted: true });
  }

  public componentWillUnmount(): void {
    this.setState({ mounted: false } );
  }

  public render(): ReactNode {

    const { classes } = this.props;
    const { mounted } = this.state;

    return (
      <Grid
        className={classes.root}
        direction={"column"}
        wrap={"nowrap"}
        container
      >

        <StreamingHeaderBar {...{} as IStreamingHeaderBarInjectedProps}/>

        <Fade in={mounted}>

          <Grid className={classes.content} direction={"column"} wrap={"nowrap"} container>

            Configuration page.

          </Grid>

        </Fade>

      </Grid>
    );
  }

}
