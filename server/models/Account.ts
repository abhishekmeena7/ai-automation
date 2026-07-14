import mongoose from "mongoose"
import zernio from "../config/zernio.js"

const accountSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: { type: String, enum: ["twitter", "linkdin", "facebook", "instagram", "facebook_page", "linkdin_page", "instagram_page"], require: true },
    handle: { type: String, required: true },
    zernioAccountId: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiresAt: { type: Date },
    status: { type: String, enum: ["connected", "disconnected"], default: "connected" },
    avatarUrl: { type: String }
}, { timestamps: true })

export const Account = mongoose.model("Account",accountSchema)