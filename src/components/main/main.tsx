import {MouseEventHandler, useContext, useState} from 'react';
import {Col, Row} from "antd";
import Chessboard from './chessboard/chessboard';
import Sidebar from './sidebar/sidebar';

interface MainProps {
    fen: string | null,
    playGame: MouseEventHandler,
    playing: boolean,
    reset: MouseEventHandler,
    orientation: "white" | "black",
    pgn: string | null,
}
export function Main({fen, orientation, playGame, reset, playing, pgn}:MainProps){
    return <main>
        <Row>
            <Col xs={24} md={16}>
                <Chessboard fen={fen ? fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"} pgn={pgn} orientation={orientation} playing={playing}/>
            </Col>
            <Col xs={12} md={6} style={{margin: "auto"}}>
                <Sidebar playGame={playGame} reset={reset} playing={playing} pgn={pgn} />
            </Col>
        </Row>
    </main>
}