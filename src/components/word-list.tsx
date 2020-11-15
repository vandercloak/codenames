import React from "react";
import {
  Row,
  Col,
  Typography,
  List,
  Form,
  Input,
  Space,
  Button,
  Select,
} from "antd";
import { teamCards } from "./card";
import { GameState } from "../types/game";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const WordList = ({
  gameState,
  red,
  blue,
  spy,
}: {
  gameState: GameState;
  red: string[];
  blue: string[];
  spy: string[];
}) => {
  const redColor = teamCards["red"].color;
  const blueColor = teamCards["blue"].color;
  const blackColor = teamCards["black"].color;

  return (
    <Row
      justify="center"
      style={{ maxWidth: 450, margin: "auto", padding: 50 }}
      className="word-list"
    >
      <Title level={3} style={{ marginBottom: 40 }}>
        You are a Spymaster 😎
      </Title>
      <Col span={8}>
        <Title level={4} style={{ color: redColor }}>
          Red
        </Title>
        {red.map((word: string) => {
          const crossed = gameState.cards[word].clicked;
          return (
            <>
              <Text
                style={{
                  fontSize: 16,
                  color: redColor,
                  textDecoration: crossed ? "line-through" : "",
                }}
              >
                {word}
              </Text>
              <br />
            </>
          );
        })}
      </Col>
      <Col span={8}>
        <Title level={4} style={{ color: blueColor }}>
          Blue
        </Title>
        {blue.map((word: string) => {
          const crossed = gameState.cards[word].clicked;

          return (
            <>
              <Text
                style={{
                  fontSize: 16,
                  color: blueColor,
                  textDecoration: crossed ? "line-through" : "",
                }}
              >
                {word}
              </Text>
              <br />
            </>
          );
        })}
      </Col>
      <Col span={8}>
        <Title
          level={4}
          style={{
            color: blackColor,
          }}
        >
          Spy
        </Title>
        <Text style={{ fontSize: 16, color: blackColor }}>{spy}</Text>
      </Col>
      <Col span={24} style={{ marginTop: 30 }}>
        <Form name="dynamic_form_nest_item" autoComplete="off">
          <Form.List name="users">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row gutter={12}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, "clue"]}
                        fieldKey={[field.fieldKey, "clue"] as any}
                      >
                        <Input placeholder="Clue" />
                      </Form.Item>
                    </Col>
                    <Col span={14}>
                      <Form.Item
                        {...field}
                        name={[field.name, "words"]}
                        fieldKey={[field.fieldKey, "words"] as any}
                      >
                        <Select
                          placeholder="Words"
                          mode="tags"
                          notFoundContent={"Type a word"}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2} style={{ paddingTop: 2 }}>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add New Clue (Just seen by you)
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
        {/* <List
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text mark>[ITEM]</Typography.Text> {item}
            </List.Item>
          )}
        /> */}
      </Col>
    </Row>
  );
};

export default WordList;
