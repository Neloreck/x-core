import { Bind, Consume } from "dreamstate";
import * as React from "react";
import { ChangeEvent, Component, ReactNode } from "react";

// Lib.
import { Styled } from "@Lib/decorators";
import { AbstractCanvasGraphicsRenderObject } from "@Lib/graphics";
import { VerticalDraggableVHResizer } from "@Lib/react_lib/components";
import { Optional } from "@Lib/ts/types";

// Data.
import { graphicsContextManager, IGraphicsContext } from "@Module/stream/data/store";
import { getDescriptor } from "@Module/stream/data/utils/RenderingUtils";
import { ICanvasObjectDescriptor } from "@Module/stream/lib/graphics/description";

// View.
import {
  Button,
  Checkbox, FormControlLabel, Grid, Grow, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Switch,
  Typography, WithStyles
} from "@material-ui/core";
import { ArrowDownward, ArrowUpward, Delete, FileCopy } from "@material-ui/icons";
import {
  IObjectTemplateConfigurationBlockInjectedProps,
  ObjectTemplateConfigurationBlock
} from "@Module/stream/view/components/tabs/objects_configuration/ObjectTemplateConfigurationBlock";
import { objectsConfigurationTabStyle } from "./ObjectsConfigurationTab.Style";

// Props.
export interface IObjectsConfigurationTabState {
  showLayerControls: boolean;
  listWidth?: number;
}

export interface IObjectsConfigurationTabInjectedProps extends WithStyles<typeof objectsConfigurationTabStyle>, IGraphicsContext {}
export interface IObjectsConfigurationTabOwnProps {}
export interface IObjectsConfigurationTabProps extends IObjectsConfigurationTabOwnProps, IObjectsConfigurationTabInjectedProps {}

@Consume(graphicsContextManager)
@Styled(objectsConfigurationTabStyle)
export class ObjectsConfigurationTab extends Component<IObjectsConfigurationTabProps, IObjectsConfigurationTabState> {

  public state: IObjectsConfigurationTabState = {
    listWidth: undefined,
    showLayerControls: false
  };

  public render(): ReactNode {

    const { classes, graphicsState: { selectedObject } } = this.props;
    const { listWidth } = this.state;

    const sectionSize: number | undefined =  selectedObject !== null && listWidth ? listWidth : undefined;

    return (
      <Grid className={classes.root} wrap={"nowrap"} container>

        <Grid
          className={classes.objectsList}
          style={{ width: sectionSize, maxWidth: sectionSize }}
        >
          {this.renderObjectsList()}
        </Grid>

        {
          selectedObject !== null
            ?
            <>
              <VerticalDraggableVHResizer className={classes.resizer} onHeightResize={this.onListResized}/>
              <Grid className={classes.objectsConfigurationBlock}> {this.renderSelectedObjectConfigBlock()} </Grid>
            </>
            : null
        }

      </Grid>
    );
  }

  private renderObjectsList(): ReactNode {

    const { classes, graphicsState: { objects, selectedObject }, graphicsActions: { swapObjectsByIndex } } = this.props;
    const { showLayerControls } = this.state;

    if (objects.length === 0) {
      return (
        <Grid className={classes.noGraphicsMessage} alignItems={"center"} justify={"center"} container>
          <Typography variant={"h5"} gutterBottom> Create at least one graphics item for configuration. </Typography>
        </Grid>
      );
    }

    return (
      <Grow in={true}>

        <List>
          <Grid className={classes.itemListControlsBlock} container justify={"space-between"} alignItems={"center"}>

            <FormControlLabel
              label={"Show Layer Controls"}
              control={<Switch checked={showLayerControls} color={"primary"}  onChange={this.onLayerControlsShowToggle}/>}
            />

            <Button variant={"outlined"} size={"small"} onClick={this.onLayoutErase}>
              Erase
              <Delete/>
            </Button>

          </Grid>

          {
            objects.map((item: AbstractCanvasGraphicsRenderObject<any>, idx: number) => {

              const descriptor: Optional<ICanvasObjectDescriptor<any>> = getDescriptor(item);

              if (!descriptor) {
                throw new Error("Descriptor for object was not found, implement it before using in list.");
              }

              return (
                <ListItem
                  key={item.getId()}
                  className={(item === selectedObject ? classes.objectListItemSelected : classes.objectListItem)}
                  onClick={(): void => this.onConfigurableObjectSelected(item)}
                >

                  <ListItemText primary={descriptor.name}/>

                  <ListItemSecondaryAction>

                    {
                      showLayerControls
                        ?
                        <Grow in={showLayerControls}>
                          <Grid className={classes.additionalListControlButtonsBlock}>
                            <IconButton onClick={(): void => swapObjectsByIndex(idx, idx + 1)} disabled={idx === objects.length - 1}>
                              <ArrowUpward fontSize="small"/>
                            </IconButton>

                            <IconButton onClick={(): void => swapObjectsByIndex(idx, idx - 1)} disabled={idx === 0}>
                              <ArrowDownward fontSize="small"/>
                            </IconButton>

                            <Checkbox
                              color={"secondary"}
                              onChange={(): void => {
                                item.isDisabled() ? item.setDisabled(false) : item.setDisabled(true);
                                this.forceUpdate();
                              }}
                              checked={!item.isDisabled()}
                            />

                            <IconButton onClick={(): void => this.onGraphicsItemCopyClicked(item)}> <FileCopy fontSize="small" /> </IconButton>
                          </Grid>
                        </Grow>
                        : null
                    }

                    <IconButton onClick={(): void => this.onGraphicsItemRemoveClicked(item)}> <Delete fontSize="small" /> </IconButton>

                  </ListItemSecondaryAction>

                </ListItem>
              );
            }).reverse()
          }
        </List>
      </Grow>
    );
  }

  private renderSelectedObjectConfigBlock(): ReactNode {

    const { graphicsState: { objects, selectedObject }, graphicsActions: { swapObjectsByIndex } } = this.props;

    if (!selectedObject) {
      return null;
    }

    return (
      <ObjectTemplateConfigurationBlock
        index={objects.indexOf(selectedObject)}
        maxIndex={objects.length - 1}
        object={selectedObject}
        onObjectIndexSwap={swapObjectsByIndex}
        onCancelSelection={this.onSelectionCanceled}
        onChangesApply={this.onObjectChangesApply}
        onSelectedRemove={this.onGraphicsItemRemoveClicked}
        {...{} as IObjectTemplateConfigurationBlockInjectedProps}
      />
    );
  }

  @Bind()
  private onListResized(newWidth: number): void {
    this.setState({ listWidth: newWidth });
  }

  @Bind()
  private onGraphicsItemRemoveClicked(object: AbstractCanvasGraphicsRenderObject<any>): void {
    this.props.graphicsActions.removeObject(object);
  }

  @Bind()
  private onGraphicsItemCopyClicked(object: AbstractCanvasGraphicsRenderObject<any>): void {

    const copy: AbstractCanvasGraphicsRenderObject<any> = object.getCopy();

    this.props.graphicsActions.addObject(copy);
    this.props.graphicsActions.selectObject(copy);
  }

  @Bind()
  private onConfigurableObjectSelected(object: AbstractCanvasGraphicsRenderObject<any>): void {
    this.props.graphicsActions.selectObject(object);
  }

  @Bind()
  private onSelectionCanceled(): void {
    this.props.graphicsActions.selectObject(null);
  }

  @Bind()
  private onObjectChangesApply(object: AbstractCanvasGraphicsRenderObject<any>): void {

    const { graphicsState: { selectedObject } } = this.props;

    if (selectedObject) {
      selectedObject.applyConfiguration(object);
    } else {
      throw new Error("Could not apply settings for unknown object, none is selected.");
    }
  }

  @Bind()
  private onLayoutErase(): void {
    this.props.graphicsActions.eraseObjects();
  }

  @Bind()
  private onLayerControlsShowToggle(event: ChangeEvent): void {
    this.setState({ showLayerControls: (event.target as any).checked });
  }

}
