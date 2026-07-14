export { connectDB } from "./mongodb";

export { default as Snippet } from "./models/Snippet";
export type { ISnippet } from "./models/Snippet";

export { default as User } from "./models/User";
export type { IUser } from "./models/User";

export { default as Follow } from "./models/Follow";
export type { IFollow } from "./models/Follow";

export { default as UserProfile } from "./models/UserProfile";
export type { IUserProfile } from "./models/UserProfile";
