import React from "react";
import "./tray-button.css";
import Icon, {
  TYPE_MUTE_CAMERA,
  TYPE_MUTE_MIC,
  TYPE_SCREEN,
  TYPE_LEAVE,
} from "../icon/icon";

/**
 * Props:
 * - type: string
 * - disabled: boolean
 * - highlighted: boolean
 * - onClick: () => ()
 * - newButtonGroup: boolean
 */
export default function TrayButton(props: any) {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      style={{ outline: "none" }}
      className={"tray-button" + (props.newButtonGroup ? " new-group" : "")}
    >
      <Icon type={props.type} highlighted={props.highlighted} />
    </button>
  );
}

export { TYPE_MUTE_CAMERA, TYPE_MUTE_MIC, TYPE_SCREEN, TYPE_LEAVE };
