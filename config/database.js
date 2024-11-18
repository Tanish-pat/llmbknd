import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({});

const MongoUri = process.env.MONGO_URI;

const connectDB = async () => {
    await mongoose.connect(MongoUri)
        .then(() => {
            console.log("Connected to MongoDB");
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        })
        .catch((error) => {
            console.log("Error: ", error.message);
        });
};

export default connectDB;
