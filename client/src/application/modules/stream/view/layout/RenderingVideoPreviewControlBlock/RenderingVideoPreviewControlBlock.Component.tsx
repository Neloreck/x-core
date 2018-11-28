import {Consume} from "@redux-cbd/context";
import * as React from "react";
import {Fragment, PureComponent} from "react";

// Lib.
import {Styled} from "@Lib/react_lib/@material_ui";
import {Optional} from "@Lib/ts/type";

// Data.
import {graphicsContextManager, IGraphicsContext} from "@Module/stream/data/store";

// View.
import {Grid, WithStyles} from "@material-ui/core";
import {CanvasObjectAdditionButtonTooltip, ICanvasObjectAdditionButtonTooltipExternalProps} from "@Module/stream/view/components/canvas_objects_management/CanvasObjectAdditionButtonTooltip";
import {IStreamingHelpButtonTooltipExternalProps, StreamingHelpButtonTooltip} from "@Module/stream/view/components/canvas_objects_management/StreamingHelpButtonTooltip";
import {IInputSourcesDrawerButtonTooltipExternalProps, InputSourcesDrawerButtonTooltip} from "@Module/stream/view/components/input_source/InputSourcesDrawerButtonTooltip/index";
import {CanvasGraphicsPreprocessor} from "@Module/stream/view/components/video_rendering/canvas_graphics_preprocessing";
import {renderingVideoPreviewControlBlockStyle} from "./RenderingVideoPreviewControlBlock.Style";

// Props.
export interface IRenderingVideoPreviewControlBlockExternalProps extends WithStyles<typeof renderingVideoPreviewControlBlockStyle>, IGraphicsContext {}

export interface IRenderingVideoPreviewControlBlockOwnProps {
  stream: Optional<MediaStream>;
}

export interface IRenderingVideoPreviewControlBlockProps extends IRenderingVideoPreviewControlBlockOwnProps, IRenderingVideoPreviewControlBlockExternalProps {}

@Consume<IGraphicsContext, IRenderingVideoPreviewControlBlockProps>(graphicsContextManager)
@Styled(renderingVideoPreviewControlBlockStyle)
export class RenderingVideoPreviewControlBlock extends PureComponent<IRenderingVideoPreviewControlBlockProps> {

  // todo: Return combined stream there ready for processing.

  public render(): JSX.Element {

    const {graphicsState: {objects, showGraphics, showGrid, showPreview, showMainVideo}, stream} = this.props;

    return (
      <Grid className={this.props.classes.root} justify={"center"} alignItems={"center"} container>

        <CanvasGraphicsPreprocessor
          stream={stream}
          showMainVideo={showMainVideo}
          renderingObjects={objects}
          showGrid={showGrid}
          showGraphics={showGraphics}
          showPreview={showPreview}
          />

        {this.renderHelpingControlTooltipButtons()}

      </Grid>
    );
  }

  private renderHelpingControlTooltipButtons(): JSX.Element {
    return (
      <Fragment>
        <CanvasObjectAdditionButtonTooltip {...{} as ICanvasObjectAdditionButtonTooltipExternalProps}/>
        <InputSourcesDrawerButtonTooltip {...{} as IInputSourcesDrawerButtonTooltipExternalProps}/>
        <StreamingHelpButtonTooltip {...{} as IStreamingHelpButtonTooltipExternalProps}/>
      </Fragment>
    );
  }

}
