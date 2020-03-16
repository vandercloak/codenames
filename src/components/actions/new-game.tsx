import React from "react";
import { Row, Col, Button, Popconfirm } from "antd";
import { createGame } from "../../utils/game";
import { GameState } from "../../types/game";
const NewGame = ({
  update,
  gameStarted = false
}: {
  update: (gameState: GameState) => void;
  gameStarted?: boolean;
}) => {
  if (!gameStarted) {
    return (
      <Button
        onClick={() => {
          update(createGame());
        }}
      >
        New Game
      </Button>
    );
  }

  return (
    <Popconfirm
      title="Are you want to start a new game?"
      onConfirm={() => {
        update(createGame());
      }}
      // onCancel={cancel}
      okText="Yes"
      cancelText="No"
    >
      <Button>New Game</Button>
    </Popconfirm>
  );
};

export default NewGame;
