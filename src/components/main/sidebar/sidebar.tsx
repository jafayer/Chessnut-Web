import { useState, MouseEventHandler, useContext } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { setPlaying } from '../../../redux/features/gameMetadataSlice';
import Button from '../../elements/button/button';
import History from "./history/history";
import {BoardContext} from "../../../App";
import GameControlPanel from "./gameControlPanel/gameControlPanel";
import GameControlButtons from "./gameControlButtons/gameControlButtons";

interface SidebarProps {
    reset: MouseEventHandler,
}

export default function Sidebar({reset}:SidebarProps) {
    const board = useContext(BoardContext);
    if(!board) {
        return null;
    }
    
    const [gameSelectorIsOpen, setGameSelectorIsOpen] = useState(false);
    const setGameSelectorOpen = () => setGameSelectorIsOpen(true);
    const setGameSelectorClosed = () => setGameSelectorIsOpen(false);

    const pgn = useAppSelector(state => state.position.pgn);
    const playing = useAppSelector(state => state.gameMetadata.playing);
    const dispatch = useAppDispatch();


    return <div style={{padding: 15}}>
        {playing && <History moves={formatPgn(pgn ? pgn : "")} />}
        <GameControlPanel isOpen={gameSelectorIsOpen} setClosed={setGameSelectorClosed}/>
        <GameControlButtons setGameSelectorOpen={setGameSelectorOpen}/>
        {/* <Button props={{block: true}} onClick={playing ? reset : playGame}>{playing ? "Reset" : "Play Locally"}</Button> */}
        <Button type="default" props={{block: true}}>Connect to Lichess</Button>
    </div>
}

function formatPgn(pgn: string): string[][] {
    const turns = pgn.split(/[0-9]*\./).slice(1).map(turn => turn.trim());
    const moves = turns.map((turn) => turn.split(" "));
    return moves;
}