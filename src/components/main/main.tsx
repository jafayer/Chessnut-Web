import { MouseEventHandler, useState } from "react";
import { Col, Row } from "antd";
import Chessboard from "./chessboard/chessboard";
import Sidebar from "./sidebar/sidebar";

interface MainProps {
  playGame: MouseEventHandler;
  reset: MouseEventHandler;
  orientation: "white" | "black";
}
export function Main({ orientation, playGame, reset }: MainProps) {
  return (
    <main>
      <Row>
        <Col xs={24} md={16}>
          <Chessboard orientation={orientation} />
        </Col>
        <Col xs={18} md={6} style={{ margin: "auto" }}>
          <Sidebar playGame={playGame} reset={reset} />
        </Col>
      </Row>
    </main>
  );
}
