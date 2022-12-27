import { MouseEventHandler } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import Button from '../../elements/button/button';
import History from "./history/history";

interface SidebarProps {
    playGame: MouseEventHandler,
    reset: MouseEventHandler,
    playing: boolean,
}

export default function Sidebar({playGame, playing, reset}:SidebarProps) {
    const pgn = useAppSelector(state => state.position.pgn);
    return <div style={{padding: 15}}>
        {playing && <History moves={formatPgn(pgn ? pgn : "")} />}
        <Button props={{block: true}} onClick={playing ? reset : playGame}>{playing ? "Reset" : "Play Locally"}</Button>
        <Button type="default" props={{block: true}}>Connect to Lichess</Button>
    </div>
}

function formatPgn(pgn: string): string[][] {
    const turns = pgn.split(/[0-9]*\./).slice(1).map(turn => turn.trim());
    const moves = turns.map((turn) => turn.split(" "));
    return moves;
}