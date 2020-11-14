import React from "react";
import "./call-message.css";

/**
 * Props:
 * - header: string
 * - detail: string
 * - isError: boolean
 */
export default function CallMessage(props: any) {
  return (
    <div className={"call-message" + (props.isError ? " error" : "")}>
      <p className="call-message-header">{props.header}</p>
      <p>{props.detail}</p>
    </div>
  );
}
