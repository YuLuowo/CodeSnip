import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User";

export interface IUserProfile extends Document {
    user: Types.ObjectId | IUser;
    bio: string;
    website: string;
    githubUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bio: { type: String, default: "" },
    website: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const UserProfile: Model<IUserProfile> = mongoose.models.UserProfile || mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
export default UserProfile;
