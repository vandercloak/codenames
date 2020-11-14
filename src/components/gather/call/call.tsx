import React, { useEffect, useContext, useReducer, useCallback } from "react";
import "./call.css";
import {
  initialCallState,
  CLICK_ALLOW_TIMEOUT,
  PARTICIPANTS_CHANGE,
  CAM_OR_MIC_ERROR,
  FATAL_ERROR,
  callReducer,
  isLocal,
  isScreenShare,
  containsScreenShare,
  getMessage,
} from "./call-state";
import { DailyCall } from "@daily-co/daily-js";
import CallObjectContext from "../../../contexts/call-object";
import { logDailyEvent } from "../../../utils/log-util";
import Tile from "../tile/tile";
import CallMessage from "../call-message/call-message";

export default function Call() {
  const callObject = useContext<DailyCall>(CallObjectContext);
  const [c, d] = useReducer<any>(callReducer, initialCallState);
  const dispatch: any = d;
  const callState: any = c;
  /**
   * Start listening for participant changes, when the callObject is set.
   */
  useEffect(() => {
    if (!callObject) return;

    const events = [
      "participant-joined",
      "participant-updated",
      "participant-left",
    ] as any;

    function handleNewParticipantsState(event?: any) {
      event && logDailyEvent(event);
      dispatch({
        type: PARTICIPANTS_CHANGE,
        participants: callObject.participants(),
      });
    }

    // Use initial state
    handleNewParticipantsState();

    // Listen for changes in state
    for (const event of events) {
      callObject.on(event, handleNewParticipantsState);
    }

    // Stop listening for changes in state
    return function cleanup() {
      for (const event of events) {
        callObject.off(event, handleNewParticipantsState);
      }
    };
  }, [callObject]);

  /**
   * Start listening for call errors, when the callObject is set.
   */
  useEffect(() => {
    if (!callObject) return;

    function handleCameraErrorEvent(event: any) {
      logDailyEvent(event);
      dispatch({
        type: CAM_OR_MIC_ERROR,
        message:
          (event && event.errorMsg && event.errorMsg.errorMsg) || "Unknown",
      });
    }

    // We're making an assumption here: there is no camera error when callObject
    // is first assigned.

    callObject.on("camera-error", handleCameraErrorEvent);

    return function cleanup() {
      callObject.off("camera-error", handleCameraErrorEvent);
    };
  }, [callObject]);

  /**
   * Start listening for fatal errors, when the callObject is set.
   */
  useEffect(() => {
    if (!callObject) return;

    function handleErrorEvent(e: any) {
      logDailyEvent(e);
      dispatch({
        type: FATAL_ERROR,
        message: (e && e.errorMsg) || "Unknown",
      });
    }

    // We're making an assumption here: there is no error when callObject is
    // first assigned.

    callObject.on("error", handleErrorEvent);

    return function cleanup() {
      callObject.off("error", handleErrorEvent);
    };
  }, [callObject]);

  /**
   * Start a timer to show the "click allow" message, when the component mounts.
   */
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch({ type: CLICK_ALLOW_TIMEOUT });
    }, 2500);

    return function cleanup() {
      clearTimeout(t);
    };
  }, []);

  /**
   * Send an app message to the remote participant whose tile was clicked on.
   */
  const sendHello = useCallback(
    (participantId) => {
      callObject &&
        callObject.sendAppMessage({ hello: "world" }, participantId);
    },
    [callObject]
  );

  function getTiles() {
    const tiles = Object.entries(callState.callItems).map(
      ([id, callItem]: any) => {
        // const isLarge =
        //   isScreenShare(id) ||
        //   (!isLocal(id) && !containsScreenShare(callState.callItems));
        const tile = (
          <Tile
            key={id}
            videoTrack={callItem.videoTrack}
            audioTrack={callItem.audioTrack}
            isLocalPerson={isLocal(id)}
            isLarge={true}
            isLoading={callItem.isLoading}
            onClick={
              isLocal(id)
                ? null
                : () => {
                    sendHello(id);
                  }
            }
          />
        );
        return tile;
      }
    );
    return tiles;
  }

  const tiles = getTiles();
  const message = getMessage(callState);
  return (
    <div className="call">
      {/* <div className="large-tiles"> */}
      {
        tiles
        // !message
        //   ? largeTiles
        //   : null /* Avoid showing large tiles to make room for the message */
      }
      {/* {message && (
        <CallMessage
          header={message.header}
          detail={message.detail}
          isError={message.isError}
        />
      )} */}
    </div>
  );
}
