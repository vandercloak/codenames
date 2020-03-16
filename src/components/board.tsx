import React from "react";
import { Row } from "antd";
import { Winner, GameState } from "../types/game";
import Card from "./card";
import { otherTeam, getGameStatus } from "../utils/game";
import debounce from "lodash/debounce";
import { PlayerState } from "../types/player";
const Board = ({
  winner,
  update,
  id,
  team,
  gameState,
  playerState
}: {
  playerState: PlayerState;
  gameState: GameState;
  winner: Winner;
  id: string;
  team: string;
  update: (gameState: GameState) => void;
}) => {
  const cards = gameState.cards;
  return (
    <Row style={{ padding: "20px 0" }}>
      {cards &&
        Object.keys(cards).map(word => {
          const { color, clicked, id } = cards[word];
          const reveal = debounce(() => {
            const notPlayerTurn = winner || team !== gameState.turn;
            if (notPlayerTurn) {
              return false;
            }
            cards[word].clicked = true;
            const { winner: newWinner } = getGameStatus(gameState!);

            if (newWinner) {
              gameState.winner = newWinner;
            }
            if (color !== team) {
              gameState.turn = otherTeam(gameState.turn);
            }

            update(gameState);
            return true;
          });
          return (
            <Card
              key={id}
              word={word}
              color={color}
              clicked={clicked}
              reveal={reveal}
              gameState={gameState}
              playerState={playerState}
            />
          );
        })}
    </Row>
  );
};

export default Board;
