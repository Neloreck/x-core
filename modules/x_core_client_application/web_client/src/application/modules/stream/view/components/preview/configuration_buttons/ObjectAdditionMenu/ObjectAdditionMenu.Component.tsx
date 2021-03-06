import { Bind, Consume } from "dreamstate";
import * as React from "react";
import { PureComponent, ReactNode } from "react";

// Lib.
import { Styled } from "@Lib/decorators";

// Data.
import { graphicsContextManager, IGraphicsContext } from "@Module/stream/data/store";
import { DESCRIPTORS_MAP, ICanvasObjectDescriptor } from "@Module/stream/lib/graphics/description";

// View.
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, WithStyles } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { objectAdditionMenuStyle } from "./ObjectAdditionMenu.Style";

// Props.
export interface IObjectAdditionMenuInjectedProps extends WithStyles<typeof objectAdditionMenuStyle>, IGraphicsContext {}
export interface IObjectAdditionMenuOwnProps {}
export interface IObjectAdditionMenuProps extends IObjectAdditionMenuOwnProps, IObjectAdditionMenuInjectedProps {}

/*
 * Object addition button menu content list.
 */
@Consume(graphicsContextManager)
@Styled(objectAdditionMenuStyle)
export class ObjectAdditionMenu extends PureComponent<IObjectAdditionMenuProps> {

  public render(): ReactNode {

    const { classes } = this.props;

    return (
      <Grid className={classes.root}>
        <List>
          {Object.values(DESCRIPTORS_MAP).map(this.renderCanvasItem)}
        </List>
      </Grid>
    );
  }

  @Bind()
  private renderCanvasItem(descriptor: ICanvasObjectDescriptor<any>): ReactNode {

    const { classes } = this.props;

    return (
      <ListItem key={"RI-" + descriptor.prototype.constructor.name} className={classes.descriptionItem}>

        <ListItemText primary={descriptor.name}/>

        <ListItemSecondaryAction className={classes.descriptorItemSecondary}>
          <IconButton aria-label={"Add"} onClick={(): void => this.onCanvasObjectAdded(descriptor)}>
            <Add/>
          </IconButton>
        </ListItemSecondaryAction>

      </ListItem>
    );
  }

  @Bind()
  private onCanvasObjectAdded(descriptor: ICanvasObjectDescriptor<any>): void {
    this.props.graphicsActions.addObject(new descriptor.prototype.constructor());
  }

}
