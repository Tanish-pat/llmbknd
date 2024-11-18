// userModel.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config({});

const secretKey = process.env.HASH_SECRET;

function sha256Hash(text) {
    return crypto.createHmac("sha256", secretKey).update(text).digest("hex");
}

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin", "clerk"],
        default: "user",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

}, { timestamps: true });

// Pre-save middleware to hash gender and role if not already hashed
userSchema.pre("save", function (next) {
    if (this.isModified("gender")) {
        // Verify that gender matches one of the allowed values before hashing
        if (["male", "female"].includes(this.gender)) {
            this.gender = sha256Hash(this.gender);
        } else {
            return next(new Error("Invalid gender value"));
        }
    }

    if (this.isModified("role")) {
        // Verify that role matches one of the allowed values before hashing
        if (["user", "admin", "clerk"].includes(this.role)) {
            this.role = sha256Hash(this.role);
        } else {
            return next(new Error("Invalid role value"));
        }
    }

    next();
});


export const User = mongoose.model("User", userSchema);