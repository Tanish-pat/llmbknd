import { url as UrlModel } from "../models/urlsModel.js";
import { UrlData as UrlDataModel } from "../models/urlDataModel.js";

// Function to create a new URL
export const createUrl = async (req, res) => {
    try {
        const { zone, endPoint } = req.body;
        // Check if zone exists
        const zoneData = await UrlDataModel.findOne({ zones: zone });
        if (!zoneData) {
            console.log("Zone does not exist");
            return res.status(404).json({ message: "Zone does not exist" });
        }
        //  Check if URL already exists
        const urlExists = await UrlModel.findOne({
            endPoint
        });
        if (urlExists) {
            console.log("URL already exists");
            return res.status(400).json({ message: "URL already exists" });
        }

        const newUrl = new UrlModel({ endPoint });
        await newUrl.save();
        zoneData.urls.push(newUrl);
        await zoneData.save();
        console.log("URL created successfully");
        return res.status(201).json({ message: "URL created successfully", data: newUrl });
    } catch (error) {
        return res.status(500).json({ message: "Error creating URL", error: error.message });
    }
};

// Function to get all zones
export const getZones = async (req, res) => {
    try {
        const zones = await UrlDataModel.find();
        if (!zones || zones.length === 0) {
            console.log("No zones found");
            return res.status(404).json({ message: "No zones found" });
        }
        console.log("Zones retrieved successfully");
        return res.status(200).json({ message: "Zones retrieved successfully", data: zones });
    } catch (error) {
        console.log("Error retrieving zones", error.message);
        return res.status(500).json({ message: "Error retrieving zones", error: error.message });
    }
};

// Function to add a new zone
export const addZone = async (req, res) => {
    try {
        const { zone } = req.body;
        // Check if zone already exists
        const zoneData = await UrlDataModel.findOne({ zones: zone });
        if (zoneData) {
            console.log("Zone already exists");
            return res.status(400).json({ message: "Zone already exists" });
        }
        const newZone = new UrlDataModel({ zones: zone });
        await newZone.save();
        console.log("Zone added successfully");
        return res.status(201).json({ message: "Zone added successfully", data: newZone });
    } catch (error) {
        console.log("Error adding zone");
        return res.status(500).json({ message: "Error adding zone", error: error.message });
    }
};

// Function to get all URLs from a specific zone
export const getUrlsFromZone = async (req, res) => {
    try {
        const { zone } = req.query;
        if (!zone) {
            console.log("Zone not provided");
            return res.status(400).json({ message: "Zone not provided" });
        }
        const zoneData = await UrlDataModel.findOne({ zones: zone }).populate("urls");
        if (!zoneData) {
            console.log("Zone not found");
            return res.status(404).json({ message: "Zone not found" });
        }
        console.log("URLs retrieved successfully");
        return res.status(200).json({ message: "URLs retrieved successfully", data: zoneData.urls });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving URLs", error: error.message });
    }
};
