import { IUser } from "@codesnip/db";

export interface ISnippetClient {
    _id: string;
    title: string;
    desc: string;
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

export interface FollowingUser {
    _id: string;
    name: string;
    username: string;
    image: string;
}

export interface FollowingResponse {
    following: FollowingUser[];
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