import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User";
import { ISnippet } from "./Snippet";

export interface IComment extends Document {
    snippet: Types.ObjectId | ISnippet;
    author: Types.ObjectId | IUser;
    content: string;
    parentComment: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
    snippet: { type: Schema.Types.ObjectId, ref: "Snippet", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

CommentSchema.index({ snippet: 1, createdAt: -1 });

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
