import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import Route from './routes/Route.js';

dotenv.config({});

const app = express();

const PORT = process.env.PORT;


// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api", Route);


// Connect to Database and Start Server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    });

// Global error handler for unhandled errors
process.on('unhandledRejection', (error) => {
    console.error("Unhandled Rejection:", error.message);
});

process.on('uncaughtException', (error) => {
    console.error("Uncaught Exception:", error.message);
    process.exit(1); // Exit the process if the error is severe
});





