import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { useMutation, useSubscription } from "urql";
import { useRouteMatch, Switch, Route } from "react-router-dom";
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
  Card,
  Form,
  TimePicker,
} from "antd";
import moment from "moment";
import { createGame, getGameStatus } from "../../utils/game";
import Board from "../../components/board";
import { GameState } from "../../types/game";
import NewGame from "../../components/actions/new-game";
import { getUserId } from "../../utils/player";
import isEqual from "lodash/isEqual";
import { GameMenu } from "../../components/game-menu";
import { useThemes } from "../../hooks/use-themes";
import { teamCards } from "../../components/card";
import Gather from "../../components/gather/gather";
import Countdown, { CountdownRenderProps } from "react-countdown";
import QRCode from "qrcode.react";

import {
  addMilliseconds,
  addMinutes,
  addSeconds,
  differenceInMilliseconds,
  getMinutes,
  getSeconds,
} from "date-fns";
import FormItem from "antd/lib/form/FormItem";
import { min, now } from "lodash";
import { useRecoilValue } from "recoil";
import { screenState } from "../../components/gather/view-state";
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

const Game = () => {
  const {
    path,
    params: { id },
  } = useRouteMatch<{ id: string }>();
  const { theme, darkMode } = useThemes();
  const viewType = useRecoilValue(screenState);
  const [result] = useSubscription({
    query: subscribeToGame,
    variables: { id },
  });
  const [, update] = useMutation(updateState);
  const [isSpymaster, setIsSpymaster] = useState(false);
  const [timerInterval, changeInterval] = useState<moment.Moment>(
    moment("00:02:00", "HH:mm:ss")
  );
  const { error, data, fetching } = result;
  const [gameState, setGameState] = useState<GameState | undefined>();
  const now = new Date();
  useEffect(() => {
    const gameStateResult = data?.res?.gameState;
    if (gameStateResult && !isEqual(gameStateResult, gameState)) {
      setGameState(gameStateResult);
    }
  }, [data]);

  const updateGameState = (gameState: GameState) => {
    update({ id, gameState });
  };

  const countdown = useMemo(() => {
    return (
      <Countdown daysInHours date={new Date(gameState?.timerEnd || now)} />
    );
  }, [gameState?.timerEnd]);

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
    <Switch>
      <Route exact path={`${path}/spymaster`}>
        <WordList
          gameState={gameState}
          red={gameState.teams.red}
          blue={gameState.teams.blue}
          spy={gameState.teams.black}
        />
      </Route>
      <Route exact path={`${path}`}>
        <Row
          style={{
            height: "100%",
            paddingBottom: 0,
            backgroundColor: theme.backgroundColor,
          }}
        >
          <Col xs={20} lg={18}>
            <div
              className={theme.classOverride}
              style={{ maxWidth: 1000, margin: "auto" }}
            >
              <Row justify="center" style={{ padding: "40px 20px" }}>
                <Col span={24}>
                  <PageHeader
                    style={{
                      paddingLeft: 3,
                      paddingRight: 3,
                      marginBottom: 0,
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
                    <Row gutter={24}>
                      <Col sm={9}>
                        <Card
                          className="setting-card"
                          style={{
                            height: "100%",
                            backgroundColor: theme.backgroundColor,
                          }}
                        >
                          <Typography.Text
                            strong
                            style={{ fontSize: 15, color: theme.color }}
                          >
                            Score
                          </Typography.Text>
                          <br />
                          <Row>
                            <Col span={24}>Red needs {red} more</Col>
                            <Col span={24}>Blue needs {blue} more</Col>
                            <br />
                            <br />
                            <Button
                              onClick={() => {
                                setIsSpymaster(false);
                                updateGameState(createGame());
                              }}
                            >
                              New Game
                            </Button>
                          </Row>
                        </Card>
                      </Col>
                      <Col sm={8}>
                        <Card
                          className="setting-card"
                          style={{
                            height: "100%",
                            backgroundColor: theme.backgroundColor,
                            color: theme.color,
                          }}
                        >
                          <Typography.Text
                            strong
                            style={{ fontSize: 15, color: theme.color }}
                          >
                            Timer: {countdown}
                          </Typography.Text>
                          <br />
                          <Form layout="vertical">
                            <Form.Item
                              label={
                                <div
                                  style={{ marginTop: -15, marginBottom: -22 }}
                                >
                                  Change timer
                                </div>
                              }
                              colon={false}
                            >
                              <TimePicker
                                showNow={false}
                                value={timerInterval}
                                format="mm:ss"
                                onChange={(time) =>
                                  time && changeInterval(time)
                                }
                              />
                            </Form.Item>
                          </Form>
                          <Button
                            onClick={() => {
                              const seconds = getSeconds(
                                timerInterval.toDate()
                              );
                              const minutes = getMinutes(
                                timerInterval.toDate()
                              );
                              const newTimerEnd = addMinutes(
                                addSeconds(new Date(), seconds),
                                minutes
                              ).toString();

                              updateGameState({
                                ...gameState,
                                timerEnd: newTimerEnd,
                              });
                            }}
                          >
                            Start New Timer
                          </Button>
                        </Card>
                      </Col>
                      <Col sm={7}>
                        <Card
                          className="setting-card"
                          style={{
                            height: "100%",
                            backgroundColor: theme.backgroundColor,
                            color: theme.color,
                          }}
                        >
                          <Typography.Text
                            strong
                            style={{ fontSize: 15, color: theme.color }}
                          >
                            👇 Spymaster Scan Here
                          </Typography.Text>
                          <br />
                          <div style={{ marginTop: 15 }}>
                            <QRCode
                              style={{
                                width: 100,
                                height: 100,
                              }}
                              value={
                                window.location.origin +
                                window.location.pathname +
                                "/spymaster"
                              }
                            />
                          </div>
                        </Card>
                      </Col>
                    </Row>
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
                          gameState={gameState}
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
          <Col
            xs={viewType === "tile" ? 4 : undefined}
            lg={viewType === "tile" ? 6 : undefined}
            className={viewType === "full" ? "full-screen" : "tiles"}
          >
            <Gather />
          </Col>
        </Row>
      </Route>
    </Switch>
  );
};

export default Game;
