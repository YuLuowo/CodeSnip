import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    image?: string;
    likedSnippets: Types.ObjectId[];
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    likedSnippets: [{ type: Schema.Types.ObjectId, ref: "Snippet" }],
    createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
