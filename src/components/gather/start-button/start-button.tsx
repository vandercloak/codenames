import { Button } from "antd";
import React from "react";
import "./start-button.css";

/**
 * Props:
 * - disabled: boolean
 * - onClick: () => ()
 */
export default function StartButton(props: any) {
  return (
    <Button
      className="start-button"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      Join Video Call
    </Button>
  );
}
