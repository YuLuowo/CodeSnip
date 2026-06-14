import { IUser } from "@/models/User";

export interface ISnippetClient {
    _id: string;
    title: string;
    language: string;
    code: string;
    tags: string[];
    isPublic: boolean;
    author: IUser;
    likes: string[];
    likesCount: number;
    createdAt: string;
    updatedAt: string;
}