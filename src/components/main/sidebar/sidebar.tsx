import { MouseEventHandler } from 'react';
import Button from '../../elements/button/button';

interface SidebarProps {
    playGame: MouseEventHandler,
    reset: MouseEventHandler,
    playing: boolean,
    pgn?: string | null,
}

export default function Sidebar({playGame, playing, reset, pgn}:SidebarProps) {
    return <div style={{padding: 15}}>
        {pgn && <div>{formatPgn(pgn)}</div>}
        <Button props={{block: true}} onClick={playing ? reset : playGame}>{playing ? "Reset" : "Play Locally"}</Button>
        <Button type="default" props={{block: true}}>Connect to Lichess</Button>
    </div>
}

function formatPgn(pgn: string) {
    const turns = pgn.split(/[1-9]*\./).slice(1).map(turn => turn.trim());
    const moves = turns.map((turn) => turn.split(" "));
    return <ul style={{height: 300, overflowY: "scroll"}}>
        {moves.map((turn, index) => {
            return <li style={{margin: 5}}>
            <span style={{background: "darkgrey", color: "#fff", padding: 5}}>{index+1}</span>
            <span style={{background: "lightgrey", padding: "5px 0px"}}>{turn[0]}</span>
            {turn[1] && <span>{turn[1]}</span>}
        </li>
        })}
    </ul>
}