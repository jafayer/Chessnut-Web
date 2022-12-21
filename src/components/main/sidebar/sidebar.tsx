import { MouseEventHandler } from 'react';
import Button from '../../elements/button/button';
import History from "./history/history";

interface SidebarProps {
    playGame: MouseEventHandler,
    reset: MouseEventHandler,
    playing: boolean,
    pgn?: string | null,
}

export default function Sidebar({playGame, playing, reset, pgn}:SidebarProps) {
    return <div style={{padding: 15}}>
        {pgn && <History moves={formatPgn(pgn)} />}
        <Button props={{block: true}} onClick={playing ? reset : playGame}>{playing ? "Reset" : "Play Locally"}</Button>
        <Button type="default" props={{block: true}}>Connect to Lichess</Button>
    </div>
}

function formatPgn(pgn: string): string[][] {
    const turns = pgn.split(/[1-9]*\./).slice(1).map(turn => turn.trim());
    const moves = turns.map((turn) => turn.split(" "));
    return moves;
}