import React, { useState, useEffect } from "react";
import { Card as ACard } from "antd";
import { useWindowSize } from "../hooks/useWindowSize";
import { TeamColor, GameState } from "../types/game";
import { useThemes } from "../hooks/use-themes";
import RedCard from "../assets/card-red.png";
import BlueCard from "../assets/card-blue.png";
import YellowCard from "../assets/card-yellow.png";
import BlackCard from "../assets/card-black.png";

export const teamCards = {
  red: {
    image: RedCard,
    color: "#ac2a23",
  },
  blue: {
    image: BlueCard,
    color: "#0f3c91",
  },
  yellow: {
    image: YellowCard,
    color: "#b8ac93",
  },
  black: {
    image: BlackCard,
    color: "#1e1b18",
  },
};

const Card = ({
  color,
  clicked,
  word,
  reveal,
  gameState,
  isSpymaster,
}: {
  color: TeamColor;
  clicked: boolean;
  word: string;
  gameState: GameState;
  isSpymaster?: boolean;
  reveal: () => boolean;
}) => {
  const { theme, darkMode } = useThemes();
  const [hovering, setHovering] = useState(false);
  const size = useWindowSize();
  const cardWidth = Math.floor(size.width! / 5 - (size.width! > 1200 ? 10 : 0));
  const cardHeight = Math.floor((cardWidth * 1) / 2);

  return (
    <div style={{ width: "20%", cursor: "pointer" }}>
      <div style={{ position: "relative" }}>
        {(!clicked || hovering) && (
          <span
            onClick={() => {
              reveal();
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              position: "absolute",
              opacity: 1,
              fontWeight: 600,
              fontSize: 18,
              zIndex: 1000,
              color: clicked ? "white" : theme.color,
            }}
          >
            {word.toUpperCase()}
          </span>
        )}
        <ACard
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={() => {
            reveal();
          }}
          bodyStyle={{ display: "grid", height: "100%", padding: 0 }}
          style={{
            transition: ".2s",
            transitionTimingFunction: "ease-in-out",
            WebkitFilter: hovering && clicked ? "blur(1px)" : "",
            filter: hovering && clicked ? "blur(1px) brightness(50%)" : "",
            margin: size.width! > 700 ? 5 : 2,
            textAlign: "center",
            height: cardHeight,
            backgroundImage: `url(${
              (clicked && teamCards[color].image) || undefined
            })`,
            backgroundSize: "cover",
            color: isSpymaster ? "#fff" : theme.color,
            border: theme.border,
            // border: ;// 1px solid #c7c1c1
            borderRadius: "5%",
            boxShadow: theme.boxShadow,
            maxHeight: 115,
            maxWidth: 185,
            backgroundColor:
              isSpymaster && !clicked
                ? teamCards[color].color
                : theme.backgroundColor,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              margin: "auto",
            }}
          ></div>
        </ACard>
      </div>
    </div>
  );
};

export default Card;
