import { useState, useEffect, useRef, MutableRefObject } from "react";
import styles from "./history.module.scss";
import { useAppSelector } from "../../../../redux/hooks";

export type HistoryProps = {
  moves: string[][]; // gotta fix that
  changeState?: CallableFunction;
};

export default function History({ moves }: HistoryProps) {
  const historyRef = useRef<HTMLUListElement | null>(null);
  const [ignoreScroll, setIgnoreScroll] = useState<boolean>(false);
  const theme = useAppSelector((state) => state.theme.theme);
  useEffect(() => {
    if (historyRef.current && !ignoreScroll) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [moves]);
  return (
    <ul style={computeStyles()} ref={historyRef} onScroll={(e) => {
        const element = (e.target as HTMLUListElement);
        if(!(element.scrollHeight - (element.scrollTop+310) < 5)) {
            setIgnoreScroll(true);
        } else {
            if(ignoreScroll) {
                setIgnoreScroll(false);
            }
        }
    }}>
      {moves.map((move, index) => {
        return (
          <HistoryRow
            key={index.toString() + move.toString()}
            move={move}
            index={index}
          />
        );
      })}
    </ul>
  );

  function computeStyles(): object {
    return {
      backgroundColor: theme === "light" ? "#fff" : "#eee",
      borderRadius: 5,
      listStyleType: "none",
      padding: 5,
      margin: 5,
      height: 300,
      overflowY: "scroll",
    };
  }
}

type HistoryRowProps = {
  move: string[];
  index: number;
};
function HistoryRow({ move, index }: HistoryRowProps) {
  return (
    <li className={styles["row"]}>
      <span className={styles["numbering"]}>{index + 1}</span>
      <span className={styles["whiteMove"]}>{move[0]}</span>
      {move.length == 2 && (
        <span className={styles["blackMove"]}>{move[1]}</span>
      )}
    </li>
  );
}
