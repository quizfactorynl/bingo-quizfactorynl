import { ObjectId } from "mongodb";

export interface BingoDocType {
    _id: string | ObjectId
    title: string
}

export interface MusicDocType {
    _id?: string;
    bingo_id: string;
    title: string;
    artist: string;
}

export interface ReferenceCodeDocType {
    _id: string;
    code: string;
    bingo_id: string;
}
