import { Bind } from "@redux-cbd/utils";
import * as React from "react";
import { ChangeEvent, Component, ReactNode } from "react";

// Lib.
import { HorizontalDraggableVHResizer } from "@Lib/react_lib/components";
import { Styled } from "@Lib/react_lib/mui";

// Data.

// View.
import { AppBar, Grid, Tab, Tabs, WithStyles } from "@material-ui/core";
import {
  GeneralConfigurationTab, IGeneralConfigurationTabExternalProps
} from "@Module/stream/view/components/tabs/general_configuration/GeneralConfigurationTab";
import { ILayoutConfigurationTabExternalProps, LayoutConfigurationTab } from "@Module/stream/view/components/tabs/layouts_configuration/LayoutConfigurationTab/LayoutConfigurationTab.Component";
import {
  IObjectsConfigurationTabExternalProps, ObjectsConfigurationTab
} from "@Module/stream/view/components/tabs/objects_configuration/ObjectsConfigurationTab";
import { IStatsTabExternalProps, StatsTab } from "@Module/stream/view/components/tabs/stats/StatsTab";
import { mainPreviewTabsStyle } from "./MainPreviewTabs.Style";

// Props.
export interface IMainPreviewTabsState {
  currentTab: number;
  tabsHeight?: number;
}

export interface IMainPreviewTabsExternalProps extends WithStyles<typeof mainPreviewTabsStyle> {}
export interface IMainPreviewTabsOwnProps {}
export interface IMainPreviewTabsProps extends IMainPreviewTabsOwnProps, IMainPreviewTabsExternalProps {}

@Styled(mainPreviewTabsStyle)
export class MainPreviewTabs extends Component<IMainPreviewTabsProps, IMainPreviewTabsState> {

  public readonly state: IMainPreviewTabsState = {
    currentTab: 0,
    tabsHeight: undefined
  };

  public render(): ReactNode {

    const { classes } = this.props;
    const { currentTab, tabsHeight } = this.state;

    let tabContent: ReactNode;

    switch (currentTab) {
      case 0:
        tabContent = <GeneralConfigurationTab {...{} as IGeneralConfigurationTabExternalProps}/>;
        break;

      case 1:
        tabContent = <ObjectsConfigurationTab {...{} as IObjectsConfigurationTabExternalProps}/>;
        break;

      case 2:
        tabContent = <div> Sounds - Todo... </div>;
        break;

      case 3:
        tabContent = <LayoutConfigurationTab {...{} as ILayoutConfigurationTabExternalProps}/>;
        break;

      case 4:
        tabContent = <div> Resources - Todo... </div>;
        break;

      case 5:
        tabContent = <StatsTab {...{} as IStatsTabExternalProps}/>;
        break;

      default:
        // Nothing to render.
        break;
    }

    return (
      <Grid
        className={classes.root}
        style={tabsHeight ? { height: `${tabsHeight}px` } : undefined}
        direction={"column"}
        wrap={"nowrap"}
        container
      >

        <HorizontalDraggableVHResizer className={classes.resizer} onHeightResize={this.onTabResize}/>

        <AppBar position={"relative"} color={"default"}>

          <Tabs
            value={this.state.currentTab}
            onChange={this.onTabChange}
            scrollButtons={"on"}
            indicatorColor={"primary"}
            textColor={"primary"}
          >
            <Tab label={"General"}/>
            <Tab label={"Graphics"}/>
            <Tab label={"Sound"}/>
            <Tab label={"Layout"}/>
            <Tab label={"Resources"}/>
            <Tab label={"Stats"}/>
          </Tabs>

        </AppBar>

        <Grid className={classes.tabContent} container>
          {tabContent}
        </Grid>

      </Grid>
    );
  }

  @Bind()
  private onTabResize(newHeight: number): void {
    this.setState({ tabsHeight: newHeight });
  }

  @Bind()
  private onTabChange(event: ChangeEvent<any>, tabNumber: any): void {
    this.setState({ currentTab: +tabNumber });
  }

}
