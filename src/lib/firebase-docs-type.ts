export interface MusicDocType {
    id: string;
    title: string;
    artist: string;
}

export interface BingoDocType {
    id: string;
    title: string;
}

export interface RefCodeDocType {
    code: string;
    id: string;
    bingo_id: string;
    bingo_name?: string;
}

