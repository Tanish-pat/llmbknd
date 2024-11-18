// urlDataModel.js
import mongoose from "mongoose";
const urlDataSchema = new mongoose.Schema({
    zones: {
        type: String,
        enum: ["EU", "FE", "NA", "AP", "SA", "AF", "WW"],
        required: true
    },
    urls: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "url"
    }]

}, { timestamps: true });

export const UrlData = mongoose.model("UrlData", urlDataSchema);