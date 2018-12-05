import {ReactContextManager} from "@redux-cbd/context";
import {Bind} from "@redux-cbd/utils";

import {Optional} from "@Lib/ts/type";
import {Logger} from "@Lib/util/logger";

import {localMediaService} from "@Module/stream/data/services/local_media";
import {IInputSourceDevices} from "@Module/stream/data/store/source/models/IInputSourceDevices";

export interface ISourceContext {
  sourceActions: {
    updateInputStreamAndSources: (stream: MediaStream, devices: IInputSourceDevices) => void;
    updateInputSources: (devices: IInputSourceDevices) => void;
    updateInputStream: (stream: Optional<MediaStream>) => void;
    updateOutputStream: (stream: Optional<MediaStream>) => void;
  };
  sourceState: {
    inputStream: Optional<MediaStream>;
    outputStream: Optional<MediaStream>;
    selectedDevices: IInputSourceDevices;
  };
}

export class SourceContextManager extends ReactContextManager<ISourceContext> {

  protected context: ISourceContext = {
    sourceActions: {
      updateInputSources: this.updateInputSources,
      updateInputStream: this.updateInputStream,
      updateInputStreamAndSources: this.updateInputStreamAndSources,
      updateOutputStream: this.updateOutputStream,
    },
    sourceState: {
      inputStream: null,
      outputStream: null,
      selectedDevices: {
        audioInput: null,
        videoInput: null
      }
    }
  };

  private log: Logger = new Logger("[SOURCE_CONTEXT]", false);

  @Bind()
  protected updateInputSources(selectedDevices: IInputSourceDevices): void {
    this.updateStateRef();
    this.context.sourceState.selectedDevices = selectedDevices;
    this.update();
  }

  @Bind()
  protected updateInputStreamAndSources(inputStream: MediaStream, selectedDevices: IInputSourceDevices): void {
    this.updateStateRef();
    localMediaService.killStream(this.context.sourceState.inputStream);
    this.context.sourceState.inputStream = inputStream;
    this.context.sourceState.selectedDevices = selectedDevices;
    this.update();
  }

  @Bind()
  protected updateOutputStream(outputStream: Optional<MediaStream>): void {
    this.updateStateRef();
    this.context.sourceState.outputStream = outputStream;
    this.update();
  }

  @Bind()
  protected updateInputStream(inputStream: Optional<MediaStream>): void {
    this.updateStateRef();
    localMediaService.killStream(this.context.sourceState.inputStream);
    this.context.sourceState.inputStream = inputStream;
    this.update();
  }

  @Bind()
  protected updateStateRef(): void {
    this.context.sourceState = Object.assign({}, this.context.sourceState);
  }

  @Bind()
  protected afterUpdate(): void {
    this.log.info("Context state updated:", this.context.sourceState);
  }

}
