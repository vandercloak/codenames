import React, { useState, useEffect } from "react";
import { useMutation, useSubscription } from "urql";
import WordList from "../../components/word-list";
import "./game.scss";
import {
  Row,
  Col,
  PageHeader,
  Descriptions,
  Typography,
  Tabs,
  List,
  Button,
} from "antd";
import { createGame, getGameStatus, otherTeam } from "../../utils/game";
import Board from "../../components/board";
import { GameState, TeamColor } from "../../types/game";
import JoinTeam from "../../components/actions/join-team";
import NewGame from "../../components/actions/new-game";
import { getUserId, getPlayer } from "../../utils/player";
import isEqual from "lodash/isEqual";
import capitalize from "lodash/capitalize";
import { GameMenu } from "../../components/game-menu";
import Timer from "react-compound-timer";
import { useThemes } from "../../hooks/use-themes";
import { teamCards } from "../../components/card";
import Gather from "../../components/gather/gather";

const { Paragraph } = Typography;
const subscribeToGame = `
  subscription game_by_pk($id: String!) {
    res: game_by_pk(id: $id) {
      gameState
    }
  }
`;

const updateState = `
  mutation updateState($id: String!, $gameState: json) {
    res: update_game(where: {id: {_eq: $id}}, _set: {gameState: $gameState}) {
      returning {
        gameState
      }
    }
  }
`;

const Game = ({ id }: { id: string }) => {
  const { theme, darkMode } = useThemes();
  const [timer, setTimer] = useState(120000);
  const userId = getUserId();
  const [result] = useSubscription({
    query: subscribeToGame,
    variables: { id },
  });
  const [, update] = useMutation(updateState);
  const [isSpymaster, setIsSpymaster] = useState(false);
  const { error, data, fetching } = result;
  const [gameState, setGameState] = useState<GameState | undefined>();

  useEffect(() => {
    const gameStateResult = data?.res?.gameState;
    if (gameStateResult && !isEqual(gameStateResult, gameState)) {
      setGameState(gameStateResult);
    }
  }, [data]);

  const updateGameState = (gameState: GameState) => {
    update({ id, gameState });
  };

  if (error) return <>Oh no!</>;
  if (!gameState && !fetching)
    return (
      <Row justify="center" style={{ padding: 20 }}>
        <Col>
          <NewGame update={updateGameState} />
        </Col>
      </Row>
    );
  if (!gameState) return null;

  const {
    teamStatus: { red, blue },
  } = getGameStatus(gameState);

  return (
    <Row
      style={{
        // width: "100vw",
        // height: "100vh",
        backgroundColor: theme.backgroundColor,
      }}
    >
      <Col md={20}>
        <div className={theme.classOverride}>
          <Row justify="center" style={{ padding: "40px 20px" }}>
            <Col span={24}>
              <PageHeader
                style={{
                  paddingLeft: 3,
                  paddingRight: 3,
                  backgroundColor: theme.backgroundColor,
                }}
                ghost={false}
                title={
                  <>
                    <span
                      style={{
                        color:
                          theme.key === "light"
                            ? teamCards["blue"].color
                            : teamCards["red"].color,
                      }}
                    >
                      Game
                    </span>{" "}
                    <span
                      style={{
                        color:
                          theme.key === "light"
                            ? teamCards["red"].color
                            : teamCards["blue"].color,
                      }}
                    >
                      Time!
                    </span>
                  </>
                }
                extra={[
                  <GameMenu
                    isSpymaster={isSpymaster}
                    setIsSpymaster={setIsSpymaster}
                    gameState={gameState}
                    updateGameState={updateGameState}
                  />,
                ]}
              >
                <Descriptions size="small" column={3}>
                  <Descriptions.Item label="Red team">
                    Needs {red} more
                  </Descriptions.Item>
                  <Descriptions.Item label="Blue team">
                    Needs {blue} more
                  </Descriptions.Item>
                </Descriptions>
                {/* <div>
              <Timer initialTime={timer} direction="backward">
                {({ reset }: any) => (
                  <>
                    <Button onClick={() => reset()}>Reset</Button>
                    {"  "}
                    <React.Fragment>
                      <Timer.Minutes /> minutes <Timer.Seconds /> seconds
                    </React.Fragment>
                  </>
                )}
              </Timer>
            </div> */}
              </PageHeader>
            </Col>
            <Col span={24}>
              {isSpymaster ? (
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="Board" key="1">
                    <Board
                      isSpymaster
                      gameState={gameState}
                      update={updateGameState}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Word List" key="2">
                    <WordList
                      red={gameState.teams.red}
                      blue={gameState.teams.blue}
                      spy={gameState.teams.black}
                    />
                  </Tabs.TabPane>
                </Tabs>
              ) : (
                <Board gameState={gameState!} update={updateGameState} />
              )}
            </Col>
          </Row>
        </div>
      </Col>
      <Col md={4} style={{ display: "grid", height: "100vh" }}>
        <Gather />
      </Col>
    </Row>
  );
};

export default Game;
