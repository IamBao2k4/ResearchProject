const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Users = new Schema(
    {
        googleId: { type: String, unique: true, sparse: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        verified: { type: Boolean },
        firstName: { type: String },
        lastName: { type: String },
        country: { type: String },
        address: { type: String },
        city: { type: String },
        phone: { type: String },
        avatar: {
            type: String,
            default:
                "https://pmhsxvhplpoicxuhzgqb.supabase.co/storage/v1/object/public/images//default-user.jpg",
        },
        role: { type: String, default: "Customer" },
        isBanned: { type: Boolean, default: false },
        lastSurveyScore: Number,
        surveyDate: Date,
        watchedVideos: [{ type: Number, default: 1 }],
        finishedSteps: [{ type: Number, default: 1 }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Users", Users);
