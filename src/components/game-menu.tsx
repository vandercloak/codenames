import React from "react";
import { Menu, Dropdown, Popconfirm } from "antd";
import {
  SettingOutlined,
  UserSwitchOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { GameState } from "../types/game";
import { getGameStatus, createGame, otherTeam } from "../utils/game";
import { PlayerState } from "../types/player";
import { getPlayer } from "../utils/player";
export const GameMenu = ({
  gameState,
  playerState,
  updateGameState,
  updatePlayerState
}: {
  gameState: GameState;
  playerState: PlayerState;
  updateGameState: (gameState: GameState) => void;
  updatePlayerState: (playerState: PlayerState) => void;
}) => {
  const { team, id } = getPlayer(playerState, gameState);

  const actions = {
    changeTeam: () => {
      const newState = { ...playerState };
      const player = newState[team as "red" | "blue"][id];
      delete newState[team as "red" | "blue"][id];

      if (team === "red") {
        newState.blue[id] = player;
      }
      if (team === "blue") {
        newState.red[id] = player;
      }

      updatePlayerState(newState);
    },
    becomeSpymaster: () => {
      const newState = { ...gameState };

      newState.spymasters[team as "red" | "blue"] = id;

      updateGameState(newState);
    },
    newGame: () => {
      updateGameState(createGame());
    },
    passTurn: () => {
      const newState = { ...gameState };
      newState.turn = otherTeam(newState.turn as "red" | "blue");
      updateGameState(newState);
    }
  };

  const menuOptions = {
    changeTeam: (
      <Menu.Item key="1" onClick={() => actions.changeTeam()}>
        <UserSwitchOutlined />
        Change Team
      </Menu.Item>
    ),
    becomeSpymaster: (
      <Menu.Item key="2">
        <SettingOutlined />
        I'm the Spymaster 😎
      </Menu.Item>
    ),
    newGame: (
      <Menu.Item key="3" onClick={() => actions.newGame()}>
        <PlusOutlined />
        New Game
      </Menu.Item>
    ),
    passTurn: (
      <Menu.Item key="3" onClick={() => actions.passTurn()}>
        <UserSwitchOutlined />
        Pass Turn
      </Menu.Item>
    )
  };

  if (!gameState.spymasters[team as "red" | "blue"]) {
    return (
      <Dropdown.Button
        overlay={
          <Menu>
            {menuOptions.changeTeam}
            {menuOptions.newGame}
            {menuOptions.passTurn}
          </Menu>
        }
        onClick={() => actions.becomeSpymaster()}
        icon={<SettingOutlined />}
      >
        I'm the Spymaster 😎
      </Dropdown.Button>
    );
  } else if (gameState.winner) {
    return (
      <Dropdown.Button
        onClick={() => actions.newGame()}
        overlay={<Menu>{menuOptions.changeTeam}</Menu>}
        icon={<PlusOutlined />}
      >
        New Game
      </Dropdown.Button>
    );
  }

  return (
    <Dropdown.Button
      onClick={() => actions.passTurn()}
      overlay={
        <Menu>
          {menuOptions.changeTeam}
          {menuOptions.newGame}
        </Menu>
      }
      icon={<SettingOutlined />}
    >
      Pass Turn
    </Dropdown.Button>
  );
};
