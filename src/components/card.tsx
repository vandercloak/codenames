import React, { useState } from "react";
import { Card as ACard } from "antd";
import { useWindowSize } from "../hooks/useWindowSize";
import RedCard from "../assets/card-red.png";
import BlueCard from "../assets/card-blue.png";
import YellowCard from "../assets/card-yellow.png";
import BlackCard from "../assets/card-black.png";
import { TeamColor, GameState, Winner } from "../types/game";
import { Confetti } from "./confetti";
import { getPlayer } from "../utils/player";
import { PlayerState } from "../types/player";

export const background = {
  red: {
    image: RedCard,
    color: "#ac2a23"
  },
  blue: {
    image: BlueCard,
    color: "#0f3c91"
  },
  yellow: {
    image: YellowCard,
    color: "#b8ac93"
  },
  black: {
    image: BlackCard,
    color: "#1e1b18"
  }
};
const Card = ({
  color,
  clicked,
  word,
  reveal,
  gameState,
  playerState
}: {
  color: TeamColor;
  clicked: boolean;
  word: string;
  gameState: GameState;
  playerState: PlayerState;
  reveal: () => boolean;
}) => {
  const size = useWindowSize();
  const cardWidth = Math.floor(size.width! / 5 - (size.width! > 1200 ? 10 : 0));
  const cardHeight = Math.floor((cardWidth * 1) / 2);
  const { isSpymaster } = getPlayer(playerState, gameState);

  return (
    <div style={{ width: "20%" }}>
      <Confetti winner={gameState?.winner} />
      <ACard
        onClick={() => {
          reveal();
        }}
        bodyStyle={{ display: "grid", height: "100%", padding: 0 }}
        style={{
          margin: size.width! > 700 ? 5 : 2,
          textAlign: "center",
          height: cardHeight,
          backgroundImage: `url(${(clicked && background[color].image) ||
            undefined})`,
          backgroundSize: "cover",
          border:
            isSpymaster && !clicked
              ? `4px solid ${background[color].color}`
              : "2px solid grey"
          // backgroundColor: (clicked && background[color].color) || undefined
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
            margin: "auto"
          }}
        >
          {!clicked && word.toUpperCase()}
        </div>
      </ACard>
    </div>
  );
};

export default Card;
