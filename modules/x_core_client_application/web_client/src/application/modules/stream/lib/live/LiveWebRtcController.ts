import { Bind } from "dreamstate";

// Lib.
import { Optional } from "@Lib/ts/types";
import { Logger } from "@Lib/utils";

// Data.
import {
  ELiveSocketMessageType, IErrorExchangeMessage,
  IIceCandidateExchangeMessage,
  ILiveSocketMessage,
  ISdpExchangeMessage, IStopExchangeMessage
} from "@Module/stream/lib/live/messaging";

export class LiveWebRtcController {

  private readonly log: Logger = new Logger("[🌈RTC]");

  private webRtcPeer: Optional<RTCPeerConnection> = null;
  private webRtcConfiguration: Optional<RTCConfiguration> = null;
  private webRtcOfferConfiguration: Optional<RTCOfferOptions> = null;

  private webRtcGeneratingOffer: boolean = false;
  private webRtcRenegotiating: boolean = false;

  private readonly accumulatedRemoteICECandidates: Array<RTCIceCandidate> = [];
  private readonly mediaStream: MediaStream = new MediaStream();

  private started: boolean = false;

  public async start(options: RTCConfiguration, offerOptions: RTCOfferOptions, videoTrack: MediaStreamTrack, audioTrack: Optional<MediaStreamTrack>): Promise<void> {

    this.log.info("[1] Starting RTC connection, creating RTC peer.");

    if (this.started) {
      throw new Error("RTC Already started");
    }

    this.webRtcPeer = new RTCPeerConnection(options);
    this.webRtcConfiguration = options;
    this.webRtcOfferConfiguration = offerOptions;

    this.mediaStream.addTrack(videoTrack);
    this.webRtcPeer.addTrack(videoTrack, this.mediaStream);

    if (audioTrack) {
      this.mediaStream.addTrack(audioTrack);
      this.webRtcPeer.addTrack(audioTrack, this.mediaStream);
    }

    this.webRtcPeer.onicecandidate = this.onICECandidate;
    this.webRtcPeer.onnegotiationneeded = this.onNegotiationNeeded;
    this.webRtcPeer.oniceconnectionstatechange = this.onIceConnectionStateChange;
    this.webRtcPeer.onsignalingstatechange = this.onSignallingConnectionStateChange;

    this.started = true;
  }

  public async stop(): Promise<void> {
    if (this.webRtcPeer) {
      this.onSendMessage("session.stop", { type: ELiveSocketMessageType.STOP, body: {} } as IStopExchangeMessage );
      this.webRtcPeer.close();
      this.webRtcPeer = null;
    }

    this.started = false;
  }

  public async sendSDPOffer(): Promise<void> {

    if (!this.webRtcPeer || !this.webRtcOfferConfiguration) {
      throw new Error("Cannot send SDP offer, data was corrupted.");
    }

    if (this.webRtcRenegotiating || this.webRtcGeneratingOffer) {
      return;
    }

    this.webRtcGeneratingOffer = true;

    try {
      const offer: RTCSessionDescriptionInit = await this.webRtcPeer.createOffer(this.webRtcOfferConfiguration);

      if (!offer.sdp) {
        throw new Error("Failed to generate SDP offer, got undefined.");
      }

      this.webRtcPeer.setLocalDescription(offer).then();

      this.log.info("[2] Sending local SDP offer.");

      // Send webSocket message.
      this.onSendMessage("session.sdpOffer", {
        body: {
          sdp: offer.sdp
        },
        type: ELiveSocketMessageType.SDP_OFFER
      });

    } catch (error) {
      this.onSDPGenerationError(error);
    } finally {
      this.webRtcGeneratingOffer = false;
    }
  }

  public updateVideoTrack(videoTrack: MediaStreamTrack): void {

    this.log.info("Replacing video track.");

    const actualVideoTrack: Optional<MediaStreamTrack> = this.mediaStream.getVideoTracks()[0] || null;
    const actualPeerConnection: RTCPeerConnection = this.webRtcPeer as RTCPeerConnection;

    if (actualPeerConnection && actualVideoTrack) {

      this.mediaStream.removeTrack(actualVideoTrack);
      this.mediaStream.addTrack(videoTrack);

      actualPeerConnection.getSenders().forEach((sender: RTCRtpSender) => {
        if (sender.track === actualVideoTrack) {
          sender.replaceTrack(videoTrack).then();
          return;
        }
      });
    }
  }

  public updateAudioTrack(audioTrack: Optional<MediaStreamTrack>): void {

    const actualAudioTrack: Optional<MediaStreamTrack> = this.mediaStream.getAudioTracks()[0] || null;
    const actualPeerConnection: RTCPeerConnection = this.webRtcPeer as RTCPeerConnection;

    if (!audioTrack) {

      if (actualAudioTrack) {
        this.log.info( "Disabling audio capturing.");
        actualAudioTrack.stop();
      }

      return;
    }

    if (actualPeerConnection && actualAudioTrack) {

      this.log.info("Replacing audio capturing device.");

      this.mediaStream.removeTrack(actualAudioTrack);
      this.mediaStream.addTrack(audioTrack);

      const oldSender: Optional<RTCRtpSender> = actualPeerConnection.getSenders().filter((it: RTCRtpSender): boolean => it.track === actualAudioTrack)[0];
      oldSender.replaceTrack(audioTrack).then();
    }
  }

  /*
   * Injectable handlers.
   */

  @Bind()
  public onSDPGenerationError(error: Error): void {
    throw new Error("Handler for 'onSDPGenerationError' should be injected.");
  }

  @Bind()
  public onICECandidate(connectionEvent: RTCPeerConnectionIceEvent): void {

    if (!connectionEvent.candidate) {
      return this.onIceCandidatesGatheringDone();
    }

    // # this.log.info("Sending ICE candidate.");

    this.onSendMessage("session.iceCandidate", {
      body: {
        iceCandidate: connectionEvent.candidate.toJSON()
      },
      type: ELiveSocketMessageType.ICE_CANDIDATE
    } as IIceCandidateExchangeMessage);
  }

  @Bind()
  public async onNegotiationNeeded(): Promise<void> {
    this.log.info("[1.X] Renegotiation is needed, init exchange.");
    await this.sendSDPOffer();
  }

  @Bind()
  public onIceConnectionStateChange(event: Event): any {
    // this.log.info(`ICE Connection state changed: ${(event.target as RTCPeerConnection).iceConnectionState}.`);
  }

  @Bind()
  public onSignallingConnectionStateChange(event: Event): any {
    // this.log.info(`Signalling connection state changed: ${(event.target as RTCPeerConnection).signalingState}.`);
    this.webRtcRenegotiating = (this.webRtcPeer !== null && (this.webRtcPeer.signalingState !== "closed" && this.webRtcPeer.signalingState !== "stable"));
  }

  @Bind()
  public onIceCandidatesGatheringDone(): void {
    // this.log.info("ICE candidates gathering process finished.");
  }

  @Bind()
  public onSendMessage(mapping: string, message: ILiveSocketMessage): void {
    throw new Error("Handler for 'onSendMessage' should be injected.");
  }

  /*
   * From remote signalling.
   */

  @Bind()
  public async handleSDPAnswer(message: ISdpExchangeMessage): Promise<void> {

    this.log.info("[3] Got remote SDP answer.");

    if (!this.webRtcPeer || !this.mediaStream.getTracks().length) {
      throw new Error("Cannot handle remote SDP when webRtc peer does not exist.");
    }

    await this.webRtcPeer.setRemoteDescription({ sdp: message.body.sdp, type: "answer" });

    // Complete exchange order.
    this.onSendMessage("session.complete", { type: ELiveSocketMessageType.CUSTOM, body: {} });
    this.trySynchronizeAccumulatedICECandidates();

    this.log.info("[4] Exchange process completed.");
  }

  @Bind()
  public handleAddICECandidate(message: IIceCandidateExchangeMessage): void {

    if (!this.webRtcPeer) {
      throw new Error("Cannot handle remote ICE when webRtc peer does not exist.");
    }

    const candidate: RTCIceCandidate = new RTCIceCandidate(message.body.iceCandidate);

    if (!this.webRtcPeer.remoteDescription) {
      this.accumulatedRemoteICECandidates.push(candidate);
    } else {
      // # this.log.info("Adding remote ICE.");
      this.trySynchronizeAccumulatedICECandidates();
      this.webRtcPeer.addIceCandidate(candidate).catch(this.log.error);
    }
  }

  @Bind()
  public async handleRemoteError(error: IErrorExchangeMessage): Promise<void> {
    this.log.error(error);
  }

  @Bind()
  private trySynchronizeAccumulatedICECandidates(): void {
    while (this.accumulatedRemoteICECandidates.length) {
      const candidate: RTCIceCandidate = this.accumulatedRemoteICECandidates.shift() as RTCIceCandidate;
      // # this.log.info("Adding remote ICE.");
      (this.webRtcPeer as RTCPeerConnection).addIceCandidate(candidate).catch(this.log.error);
    }
  }

}
