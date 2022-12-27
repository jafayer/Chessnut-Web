import {useState, useEffect } from "react";
import styles from "./history.module.scss";
import { useAppSelector } from "../../../../redux/hooks";

export type HistoryProps = {
    moves: string[][], // gotta fix that
    changeState?: CallableFunction
}


export default function History({moves}:HistoryProps) {
    const theme = useAppSelector((state) => state.theme.theme);
    return <ul style={computeStyles()}>
        {moves.map((move, index) => <HistoryRow move={move} index={index}/>)}
    </ul>

    function computeStyles(): object {
        return {
            backgroundColor: theme === "light" ? "#fff" : "#eee",
            borderRadius: 5,
            listStyleType: "none",
            padding: 0,
            margin: 0,
            minHeight: 500,
            width: "100%"
        }
    }
}

type HistoryRowProps = {
    move: string[],
    index: number,
}
function HistoryRow({move, index}:HistoryRowProps) {
    return <li className={styles["row"]}>
        <span className={styles["numbering"]}>{index+1}</span>
        <span className={styles["whiteMove"]}>{move[0]}</span>
        {move.length == 2 && <span className={styles["blackMove"]}>{move[1]}</span>}
    </li>
}

