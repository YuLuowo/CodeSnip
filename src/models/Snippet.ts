import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User";

export interface ISnippet extends Document {
    title: string;
    language: string;
    code: string;
    tags: string[];
    isPublic: boolean;
    author: Types.ObjectId | IUser;
    likes: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const SnippetSchema = new Schema<ISnippet>({
    title: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    tags: { type: [String], default: [] },
    isPublic: { type: Boolean, default: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Snippet: Model<ISnippet> = mongoose.models.Snippet || mongoose.model<ISnippet>("Snippet", SnippetSchema);
export default Snippet;
