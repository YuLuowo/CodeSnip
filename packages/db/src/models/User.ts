import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    image?: string;
    likedSnippets: Types.ObjectId[];
    discordId?: string;
    discordUsername?: string;
    discordAvatar?: string;
    discordLinkedAt?: Date;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    likedSnippets: [{ type: Schema.Types.ObjectId, ref: "Snippet" }],
    discordId: { type: String, unique: true, sparse: true },
    discordUsername: { type: String },
    discordAvatar: { type: String },
    discordLinkedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
