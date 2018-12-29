import {GraphicsContextManager} from "@Module/stream/data/store/graphics/GraphicsContextManager";
import {LiveContextManager} from "@Module/stream/data/store/live/LiveContextManager";
import {RenderingContextManager} from "@Module/stream/data/store/rendering/RenderingContextManager";
import {SourceContextManager} from "@Module/stream/data/store/source/SourceContextManager";

export const liveContextManager: LiveContextManager = new LiveContextManager();
export const renderingContextManager: RenderingContextManager = new RenderingContextManager();
export const graphicsContextManager: GraphicsContextManager = new GraphicsContextManager();
export const sourceContextManager: SourceContextManager = new SourceContextManager();

export {LiveContextManager, ILiveContext} from "@Module/stream/data/store/live/LiveContextManager";
export {RenderingContextManager, IRenderingContext} from "@Module/stream/data/store/rendering/RenderingContextManager";
export {GraphicsContextManager, IGraphicsContext} from "@Module/stream/data/store/graphics/GraphicsContextManager";
export {SourceContextManager, ISourceContext} from "@Module/stream/data/store/source/SourceContextManager";
