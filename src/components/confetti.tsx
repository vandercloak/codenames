import React from "react";
import ConfettiAnimation from "react-dom-confetti";
import { background } from "./card";
import { Winner } from "../types/game";

const config = {
  angle: 90,
  spread: 45,
  startVelocity: 45,
  elementCount: 50,
  dragFriction: 0.1,
  duration: 3000,
  stagger: 0,
  width: "10px",
  height: "10px"
} as any;

export const Confetti = ({ winner }: { winner: Winner }) => {
  if (winner) {
    config.colors = [background[winner].color];
  }
  return <ConfettiAnimation active={!!winner} config={config} />;
};
