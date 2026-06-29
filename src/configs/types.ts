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

export interface SnippetsResponse {
    data: ISnippetClient[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export interface UserProfileResponse {
    user: {
        _id: string;
        name: string;
        username: string;
        image: string;
    };
    profile: {
        bio: string;
        website: string;
        githubUrl: string;
    };
    followStats: {
        followersCount: number;
        followingCount: number;
        isFollowing: boolean;
    };
}