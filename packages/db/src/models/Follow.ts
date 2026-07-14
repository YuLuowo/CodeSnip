import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User";

export interface IFollow extends Document {
    follower: Types.ObjectId | IUser;
    following: Types.ObjectId | IUser;
    createdAt: Date;
}

const FollowSchema = new Schema<IFollow>({
    follower: { type: Schema.Types.ObjectId, ref: "User", required: true },
    following: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

FollowSchema.index(
    { follower: 1, following: 1 },
    { unique: true },
);

const Follow: Model<IFollow> = mongoose.models.Follow || mongoose.model<IFollow>("Follow", FollowSchema);
export default Follow;
