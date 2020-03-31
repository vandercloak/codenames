import React from "react";
import { Row, Col, Typography } from "antd";

const { Title } = Typography;

const WordList = ({
  red,
  blue,
  spy
}: {
  red: string[];
  blue: string[];
  spy: string[];
}) => {
  return (
    <Row justify="center" style={{ padding: 0 }} className="word-list">
      <Col span={8}>
        <Title level={4}>Red</Title>
        {red.map((word: string) => {
          return (
            <>
              {word}
              <br />
            </>
          );
        })}
      </Col>
      <Col span={8}>
        <Title level={4}>Blue</Title>
        {blue.map((word: string) => {
          return (
            <>
              {word}
              <br />
            </>
          );
        })}
      </Col>
      <Col span={8}>
        <Title level={4}>Spy</Title>
        {spy}
      </Col>
    </Row>
  );
};

export default WordList;
