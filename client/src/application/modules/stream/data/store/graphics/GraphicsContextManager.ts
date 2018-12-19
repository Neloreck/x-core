import {ReactContextManager} from "@redux-cbd/context";
import {Bind} from "@redux-cbd/utils";
import {throttle} from "lodash";

// Lib.
import {AbstractCanvasGraphicsRenderObject} from "@Lib/graphics";
import {Optional} from "@Lib/ts/types";
import {Logger} from "@Lib/utils";

// Props.
export interface IGraphicsContext {
  graphicsState: {
    addVisibleObjects: boolean;
    objects: Array<AbstractCanvasGraphicsRenderObject>;
    propagateRendererEvents: boolean;
    selectedObject: Optional<AbstractCanvasGraphicsRenderObject>;
    showMainVideo: boolean;
    showGraphics: boolean;
    showGrid: boolean;
    showPreview: boolean;
  };
  graphicsActions: {
    addObject: (object: AbstractCanvasGraphicsRenderObject) => void,
    eraseObjects: () => void,
    swapObjectsByIndex: (firstIndex: number, secondIndex: number) => void,
    removeObject: (object: AbstractCanvasGraphicsRenderObject) => void,
    selectObject: (object: Optional<AbstractCanvasGraphicsRenderObject>) => void,
    setAdditionVisibility: (param: boolean) => void;
    setRendererEventsPropagation: (param: boolean) => void;
    setMainVideoDisplay: (param: boolean) => void;
    setGridDisplay: (param: boolean) => void;
    setGraphicsDisplay: (param: boolean) => void;
    setPreviewDisplay: (param: boolean) => void;
  };
}

export class GraphicsContextManager extends ReactContextManager<IGraphicsContext> {

  private static SENSITIVE_ACTIONS_DELAY: number = 500;

  protected context: IGraphicsContext = {
    graphicsActions: {
      addObject: this.addObject,
      eraseObjects: this.eraseObjects,
      removeObject: this.removeObject,
      selectObject: this.selectObject,
      setAdditionVisibility: throttle(this.setAdditionVisibility, GraphicsContextManager.SENSITIVE_ACTIONS_DELAY),
      setGraphicsDisplay: throttle(this.setGraphicsDisplay, GraphicsContextManager.SENSITIVE_ACTIONS_DELAY),
      setGridDisplay: throttle(this.setGridDisplay, GraphicsContextManager.SENSITIVE_ACTIONS_DELAY),
      setMainVideoDisplay: throttle(this.setMainVideoDisplay, GraphicsContextManager.SENSITIVE_ACTIONS_DELAY),
      setPreviewDisplay: throttle(this.setPreviewDisplay, GraphicsContextManager.SENSITIVE_ACTIONS_DELAY),
      setRendererEventsPropagation: throttle(this.setRendererEventsPropagation, GraphicsContextManager.SENSITIVE_ACTIONS_DELAY),
      swapObjectsByIndex: this.swapObjectsByIndex
    },
    graphicsState: {
      addVisibleObjects: true,
      objects: [],
      propagateRendererEvents: true,
      selectedObject: null,
      showGraphics: true,
      showGrid: false,
      showMainVideo: true,
      showPreview: false
    }
  };

  private log: Logger = new Logger("[🏭GFX]", true);

  @Bind()
  public dispose(): void {

    const state = this.context.graphicsState;

    state.objects.forEach((object) => object.dispose());
    state.objects = [];
    state.selectedObject = null;

    this.log.info("Disposed graphics storage.");
  }

  @Bind()
  protected addObject(object: AbstractCanvasGraphicsRenderObject): void {

    this.log.info(`Adding new object: ${object.getName()}.`);

    if (!this.context.graphicsState.addVisibleObjects) {
      object.setDisabled(true);
    }

    this.context.graphicsState = { ...this.context.graphicsState, objects: this.context.graphicsState.objects.concat(object)};
    this.update();
  }

  @Bind()
  protected eraseObjects(): void {

    const oldObjects: Array<AbstractCanvasGraphicsRenderObject> = this.context.graphicsState.objects;

    this.context.graphicsState = { ...this.context.graphicsState, objects: [], selectedObject: null };
    this.update();

    oldObjects.forEach((object) => object.dispose());
  }

  @Bind()
  protected removeObject(object: AbstractCanvasGraphicsRenderObject): void {

    this.log.info(`Removing object: ${object.getName()}.`);

    this.context.graphicsState = { ...this.context.graphicsState, objects: this.context.graphicsState.objects.filter((it) => it !== object)};

    if (object === this.context.graphicsState.selectedObject) {
      this.context.graphicsState.selectedObject = null;
    }

    this.update();
    object.dispose();
  }

  @Bind()
  protected selectObject(selectedObject: Optional<AbstractCanvasGraphicsRenderObject>): void {

    this.log.info(`Selected object: ${selectedObject && selectedObject.getName()}.`);

    this.context.graphicsState = { ...this.context.graphicsState, selectedObject };
    this.update();
  }

  @Bind()
  protected setAdditionVisibility(addVisibleObjects: boolean): void {
    this.context.graphicsState = { ...this.context.graphicsState, addVisibleObjects };
    this.update();
  }

  @Bind()
  protected setMainVideoDisplay(showMainVideo: boolean): void {
    this.context.graphicsState = { ...this.context.graphicsState, showMainVideo };
    this.update();
  }

  @Bind()
  protected setGridDisplay(showGrid: boolean): void {
    this.context.graphicsState = { ...this.context.graphicsState, showGrid };
    this.update();
  }

  @Bind()
  protected setGraphicsDisplay(showGraphics: boolean): void {
    this.context.graphicsState = { ...this.context.graphicsState, showGraphics };
    this.update();
  }

  @Bind()
  protected setPreviewDisplay(showPreview: boolean): void {
    this.context.graphicsState = { ...this.context.graphicsState, showPreview };
    this.update();
  }

  @Bind()
  protected setRendererEventsPropagation(propagateRendererEvents: boolean): void {
    this.context.graphicsState = { ...this.context.graphicsState, propagateRendererEvents };
    this.update();
  }

  @Bind()
  protected swapObjectsByIndex(firstIndex: number, secondIndex: number): void {

    this.log.info(`Swapping object layout order: ${firstIndex} <-> ${secondIndex}.`);

    const buffer: AbstractCanvasGraphicsRenderObject = this.context.graphicsState.objects[firstIndex];

    this.context.graphicsState = { ...this.context.graphicsState, objects: [...this.context.graphicsState.objects] };
    this.context.graphicsState.objects[firstIndex] = this.context.graphicsState.objects[secondIndex];
    this.context.graphicsState.objects[secondIndex] = buffer;

    this.update();
  }

  @Bind()
  protected beforeUpdate(): void {
    this.context.graphicsState = Object.assign({}, this.context.graphicsState);
  }

}
