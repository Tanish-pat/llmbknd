// urlModel.js
import mongoose from "mongoose";
const urlSchema = new mongoose.Schema({
    endPoint:
    {
        type: String,
        required: true
    },

}, { timestamps: true });

export const url = mongoose.model("url", urlSchema);