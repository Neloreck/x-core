import {ICanvasGraphicsSizingContext, ICircleSizing, IPoint} from "../../types";
import {RelativeRenderUtils} from "../../utils";
import {AbstractCanvasGraphicsResizableObject} from "./AbstractCanvasGraphicsResizableObject";
import {ResizeHandler} from "./ResizeHandler";

export abstract class AbstractBaseCircleObject extends AbstractCanvasGraphicsResizableObject {

  protected position: ICircleSizing = {
    center: { x: 50, y: 50 },
    radius: 10
  };

  protected resizeControl: ResizeHandler = new ResizeHandler(0, this);

  // private readonly resizeControl: ResizeControl = new ResizeControl();

  // Construct with radius and center.
  public constructor();
  public constructor(radius?: number, center?: IPoint) {
    super();

    this.position.radius = radius || this.position.radius;
    this.position.center = center || this.position.center;
  }

  // Base setters for context.

  public setSizing(sizing: ICanvasGraphicsSizingContext): void {
    this.resizeControl.setSizing(sizing);
    super.setSizing(sizing);
  }

  /* Complex checks. */

  public isInBounds(targetPoint: IPoint): boolean {

    const center: IPoint = this.getBoundsCenter();
    const {heightPercent: pHeight, widthPercent: pWidth } = this.getBasePercentSizing();

    // Cast to avoid scale related things.

    return (
      Math.sqrt(Math.pow((targetPoint.x - center.x) * pWidth, 2) + Math.pow((targetPoint.y - center.y) * pHeight, 2))
      <
      pWidth * this.getBoundsRadius()
    );
  }

  public isInResizeBounds(target: IPoint): boolean {

    const {heightPercent: pHeight, widthPercent: pWidth } = this.getBasePercentSizing();

    const distance: number = Math.sqrt(Math.pow(pWidth * (target.x - this.position.center.x), 2) + Math.pow(pHeight * (target.y - this.position.center.y), 2));
    const isResizingOverBorder: boolean = (this.selected && Math.abs(this.position.radius * pWidth - distance) < 4);

    return (isResizingOverBorder || this.resizeControl.isInBounds(target));
  }

  /* Dispose everything */

  public dispose(): void {
    super.dispose();
    this.resizeControl.dispose();
  }

  /* Selection and interaction rendering. */

  public renderInteraction(context: CanvasRenderingContext2D): void {
    this.renderSelectionOverElement(context);
    this.renderResizeControls(context);
  }

  protected renderSelectionOverElement(context: CanvasRenderingContext2D): void {

    const piOffset: number = (Date.now() - this.createdAt) / 2000 * Math.PI;
    const segmentsCount: number = 8;
    const segmentLengthOffset: number = 0.1 * Math.PI;

    // Moving around selection.
    for (let it: number = 0; it < segmentsCount; it ++) {

      const offset = Math.PI * 2 / segmentsCount * it;

      RelativeRenderUtils.renderCircleSegment(
        this.getSizing(),
        context,
        this.position.center,
        this.position.radius,
        offset + piOffset, offset + piOffset + segmentLengthOffset,
        this.interactionColor,
        this.absoluteToPercentsWidth(this.interactionAbsoluteSize)
      );
    }
  }

  protected renderResizeControls(context: CanvasRenderingContext2D): void {
    this.resizeControl.render(context);
  }

  /* Moving. */

  protected onMove(moveTo: IPoint, moveFrom: IPoint): void {

    this.setBoundsCenter({
      x: this.position.center.x + (moveTo.x - moveFrom.x),
      y: this.position.center.y + (moveTo.y - moveFrom.y)
    });

    this.updateResizerPosition();
  }

  /* Resizing. */

  protected onResize(resizeTo: IPoint, resizeFrom: IPoint): void {

    const {heightPercent: pHeight, widthPercent: pWidth } = this.getBasePercentSizing();
    const distance: number = Math.sqrt(Math.pow(pWidth * (resizeTo.x - this.position.center.x), 2) + Math.pow(pHeight * (resizeTo.y - this.position.center.y), 2));

    this.position.radius = Math.max(this.absoluteToPercentsWidth(this.resizeControl.absoluteSize), this.absoluteToPercentsWidth(distance));
  }

  protected afterResize(): void {
    this.updateResizerPosition();
  }

  // Setters <-> Getters.

  protected getBoundsRadius(): number {
    return this.position.radius + 0.05;
  }

  protected setBoundsCenter(targetPoint: IPoint): void {
    this.position.center = targetPoint;
  }

  protected getBoundsCenter(): IPoint {
    return this.position.center;
  }

  // For resizers.

  private updateResizerPosition(): void {
    this.resizeControl.setRoot({
      x: this.position.center.x - this.absoluteToPercentsWidth(this.resizeControl.absoluteSize) / 2,
      y: this.position.center.y - this.absoluteToPercentsHeight(this.percentsToAbsoluteWidth(this.position.radius))
    });
  }

}
