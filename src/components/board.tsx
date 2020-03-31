import React from "react";
import { Row } from "antd";
import { Winner, GameState } from "../types/game";
import Card from "./card";
import { otherTeam, getGameStatus } from "../utils/game";
import debounce from "lodash/debounce";
const Board = ({
  update,
  gameState,
  isSpymaster
}: {
  gameState: GameState;
  isSpymaster?: boolean;
  update: (gameState: GameState) => void;
}) => {
  const cards = gameState.cards;
  return (
    <Row style={{ padding: "20px 0" }}>
      {cards &&
        Object.keys(cards).map(word => {
          const { color, clicked, id } = cards[word];
          const reveal = debounce(() => {
            cards[word].clicked = true;

            update(gameState);
            return true;
          });
          return (
            <Card
              isSpymaster={isSpymaster}
              key={id}
              word={word}
              color={color}
              clicked={clicked}
              reveal={reveal}
              gameState={gameState}
            />
          );
        })}
    </Row>
  );
};

export default Board;
