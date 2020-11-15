import React from "react";
import { Menu, Dropdown, Button, Switch, Row, Col } from "antd";
import { SettingOutlined, PlusOutlined } from "@ant-design/icons";
import { GameState } from "../types/game";
import { createGame } from "../utils/game";
import Toggle from "./night-mode-toggle";
import QRCode from "qrcode.react";

export const GameMenu = ({
  updateGameState,
  isSpymaster,
  setIsSpymaster,
}: {
  isSpymaster: boolean;
  setIsSpymaster: (val: boolean) => void;
  gameState: GameState;
  updateGameState: (gameState: GameState) => void;
}) => {
  const actions = {
    becomeSpymaster: () => {
      setIsSpymaster(true);
    },
    newGame: () => {
      setIsSpymaster(false);
      updateGameState(createGame());
    },
    releaseSpymaster: () => {
      setIsSpymaster(false);
    },
  };

  const menuOptions = {
    // becomeSpymaster: (
    //   <Menu.Item key="2">
    //     <SettingOutlined />
    //     I'm the Spymaster 😎
    //   </Menu.Item>
    // ),
    newGame: (
      <Menu.Item key="3" onClick={() => actions.newGame()}>
        <PlusOutlined />
        New Game
      </Menu.Item>
    ),
  };
  const toggle = (
    <div style={{ position: "fixed", top: 5, left: 5, zIndex: 1000 }}>
      <Toggle />
    </div>
  );

  if (isSpymaster) {
    return (
      <>
        {toggle}
        <Dropdown.Button
          overlay={<Menu>{menuOptions.newGame}</Menu>}
          onClick={() => actions.releaseSpymaster()}
          icon={<SettingOutlined />}
        >
          Relinquish the Job 😞
        </Dropdown.Button>
      </>
    );
  }

  return (
    <>
      {toggle}
      {
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 0,
            textAlign: "right",
          }}
        >
          <Row justify="end">
            <Col span={24}>
              <QRCode
                style={{ width: 100, height: 100 }}
                value={
                  window.location.origin +
                  window.location.pathname +
                  "/spymaster"
                }
              />
            </Col>
            <Col span={24}>Spymaster scan here ☝️</Col>
          </Row>
        </div>
      }
      {/* <Dropdown.Button
        overlay={<Menu>{menuOptions.newGame}</Menu>}
        onClick={() => actions.becomeSpymaster()}
        icon={<SettingOutlined />}
      >
        I'm the Spymaster 😎
      </Dropdown.Button> */}
    </>
  );
};
