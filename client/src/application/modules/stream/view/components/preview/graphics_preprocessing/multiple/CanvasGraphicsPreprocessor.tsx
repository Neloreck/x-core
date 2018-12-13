import * as React from "react";
import {PureComponent, ReactNode} from "react";

// Lib.
import {AbstractCanvasGraphicsRenderObject, CenteredTextRO, ContextCleanerRO, DomVideoRO, GridLayoutRO} from "@Lib/graphics";
import {Optional} from "@Lib/ts/types";

// View.
import {CanvasGraphicsRenderer, ICanvasGraphicsRendererExternalProps} from "./CanvasGraphicsRenderer";

// Props.
export interface ICanvasGraphicsStreamProps {
  onOutputStreamReady: (stream: Optional<MediaStream>) => void;
  showMainVideo: boolean;
  showGrid: boolean;
  showGraphics: boolean;
  showPreview: boolean;
  renderingObjects: Array<AbstractCanvasGraphicsRenderObject>;
  stream: MediaStream | null;
}

export class CanvasGraphicsPreprocessor extends PureComponent<ICanvasGraphicsStreamProps> {

  public render(): ReactNode {
    return (
      <CanvasGraphicsRenderer
        previewMode={this.props.showPreview}
        onOutputStreamReady={this.props.onOutputStreamReady}
        externalRenderingItems={this.getOutputRenderingObjectsContext()}
        internalRenderingItems={this.getPreviewRenderingObjectsContext()}
        {...{} as ICanvasGraphicsRendererExternalProps}
      />
    );
  }

  /*
   * Rendering context configuration:
   */

  /* Everything visible on preview. */
  private getPreviewRenderingObjectsContext(): Array<AbstractCanvasGraphicsRenderObject> {

    const {showGraphics, showGrid, showPreview, renderingObjects} = this.props;
    let previewItems: Array<AbstractCanvasGraphicsRenderObject> = [this.getMainVideoRenderer()];

    // Show grid for preview.
    if (showGraphics === true) {

      if (showPreview === false && showGrid === true) {
        previewItems.push(new GridLayoutRO(3, 3));
      }

      previewItems = previewItems.concat(renderingObjects);
    }

    return previewItems;
  }

  /* Everything visible on output. */
  private getOutputRenderingObjectsContext(): Array<AbstractCanvasGraphicsRenderObject> {

    const {showGraphics, renderingObjects} = this.props;
    const outputItems: Array<AbstractCanvasGraphicsRenderObject> = [this.getMainVideoRenderer()];

    // Output video and canvas items for external.
    return showGraphics === true ?  outputItems.concat(renderingObjects) : outputItems;
  }

  private getMainVideoRenderer(): AbstractCanvasGraphicsRenderObject {

    const {stream, showMainVideo} = this.props;

    // If 'display' webcam video.
    if (showMainVideo) {
      if (stream === null) {
        return new CenteredTextRO("Waiting for input stream.", 7, "#FFF");
      }

      if (stream.getVideoTracks().length === 0) {
        return new CenteredTextRO("Waiting for video.", 7, "#FFF");
      }
      return new DomVideoRO(stream);
    } else {
      return new ContextCleanerRO();
    }
  }

}
