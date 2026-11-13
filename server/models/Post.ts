// import mongoose from "mongoose"


// const postSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     content: { type: String, required: true },
//     mediaUrl: { type: String },
//     mediaType: { type: String, enum: ["Image", "Video"] },
//     platforms: [{ type: String, enum: ["twitter", "linkedin", "facebook", "instagram", "facebook_page", "linkedin_page", "instagram_business"] }],
//     scheduledFor: { type: String, enum: ["draft", "scheduled", "published", "failed"], default: "scheduled" },
// }, { timestamps: true })

// export const Post = mongoose.model("Post", postSchema)


import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    mediaUrl: {
      type: String,
      default: "",
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: null,
    },

    platforms: [
      {
        type: String,
        enum: [
          "twitter",
          "linkedin",
          "facebook",
          "instagram",
          "facebook_page",
          "linkedin_page",
          "instagram_business",
        ],
      },
    ],

    // ✅ This stores the date/time
    scheduledFor: {
      type: Date,
      required: true,
    },

    // ✅ This stores the post status
    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "failed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);