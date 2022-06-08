import { INote } from "./INote";

export interface IAllNotesWithUsers {
    id: number;
    userEmail: string;
    userPass: string;
    notes: INote[];
}