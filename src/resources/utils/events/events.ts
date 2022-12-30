export type PGN_EVENT = {
    type: "pgn",
    data: string,
}

export type FEN_EVENT = {
    type: "fen",
    data: string,
}

export type EVENTS = PGN_EVENT | FEN_EVENT;