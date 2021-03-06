import { IPoint } from "../../types";
import { AbstractCanvasGraphicsRenderObject } from "./AbstractCanvasGraphicsRenderObject";

export abstract class AbstractCanvasGraphicsInteractiveObject<T extends object> extends AbstractCanvasGraphicsRenderObject<T> {

  protected selected: boolean = false;
  protected readonly interactionSpacing: number = 0;

  protected readonly interactionColor: string = "#33ff33";
  protected readonly interactionAbsoluteSize: number = 3;

  /*
   * Interaction related.
   */

  public isInteractive(): boolean {
    return true;
  }

  public isSelected(): boolean {
    return this.selected;
  }

  public setSelected(selected: boolean): void {
    this.selected = selected;
  }

  // Is shape in coordinate bounds.
  public abstract isInBounds(checkPoint: IPoint): boolean;

  public abstract isInDeleteBounds(checkPoint: IPoint): boolean;

  public renderInteraction(context: CanvasRenderingContext2D): void {
    this.renderSelection(context);
    this.renderControls(context);
  }

  protected abstract renderControls(context: CanvasRenderingContext2D): void;

  protected abstract renderSelection(context: CanvasRenderingContext2D): void;

}
