import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config({});

const secretKey = process.env.HASH_SECRET;

function sha256Hash(text) {
    return crypto.createHmac("sha256", secretKey).update(text).digest("hex");
}

function compareHash(text, hash) {
    const textHash = sha256Hash(text);
    return textHash === hash;
}

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            console.log("Unauthorized: No token provided");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            console.log("Invalid Token");
            return res.status(401).json({ message: "Invalid Token" });
        }

        const user = await User.findById(decode.userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        req.id = req.user._id;
        console.log("User authenticated successfully");

        next();
    } catch (error) {
        console.log("Authorization error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

const isUser = (req, res, next) => {
    try {
        if (req.user && req.user.role === sha256Hash("user")) {
            console.log("User authenticated successfully");
            next();
        } else {
            console.log("Unauthorized User");
            return res.status(403).json({ message: "Access denied: User role required" });
        }
    } catch (error) {
        console.log("Authorization error:", error);
        return res.status(401).json({ message: "Unauthorized User" });
    }
}

const isAdmin = (req, res, next) => {
    try {
        if (req.user && req.user.role === sha256Hash("admin")) {
            console.log("Admin authenticated successfully");
            next();
        } else {
            console.log("Unauthorized Admin");
            return res.status(403).json({ message: "Access denied: Admins only" });
        }
    } catch (error) {
        console.log("Authorization error:", error);
        return res.status(401).json({ message: "Unauthorized Admin" });
    }
};

const isClerk = (req, res, next) => {
    try {
        if (req.user && req.user.role === sha256Hash("clerk")) {
            console.log("clerk authenticated successfully");
            next();
        } else {
            console.log("Unauthorized clerk");
            return res.status(403).json({ message: "Access denied: clerk role required" });
        }
    } catch (error) {
        console.log("Authorization error:", error);
        return res.status(401).json({ message: "Unauthorized clerk" });
    }
};

export { isAuthenticated, isUser, isAdmin, isClerk };



























// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import { User } from "../models/userModel.js";
// import dotenv from "dotenv";

// dotenv.config({});

// const secretKey = process.env.HASH_SECRET;

// function sha256Hash(text) {
//     return crypto.createHmac("sha256", secretKey).update(text).digest("hex");
// }

// function compareHash(text, hash) {
//     const textHash = sha256Hash(text);
//     return textHash === hash;
// }

// const isAuthenticated = async (req, res, next) => {
//     try {
//         const token = req.cookies.token;
//         if (!token) {
//             console.log("Unauthorized: No token provided");
//             return res.status(401).json({ message: "Unauthorized: No token provided" });
//         }

//         const decode = jwt.verify(token, process.env.JWT_SECRET);
//         if (!decode) {
//             console.log("Invalid Token");
//             return res.status(401).json({ message: "Invalid Token" });
//         }

//         const user = await User.findById(decode.userId);
//         if (!user) {
//             console.log("User not found");
//             return res.status(404).json({ message: "User not found" });
//         }

//         req.user = user;
//         req.id = req.user._id;
//         console.log("User authenticated successfully");

//         next();
//     } catch (error) {
//         console.log("Authorization error:", error);
//         return res.status(401).json({ message: "Unauthorized" });
//     }
// };

// const isUser = (req, res, next) => {
//     try {
//         // if (req.user && req.user.role === sha256Hash("user")) {
//         if (req.user && compareHash("user", req.user.role)) {
//             console.log("User authenticated successfully");
//             next();
//         } else {
//             console.log("Unauthorized User");
//             return res.status(403).json({ message: "Access denied: User role required" });
//         }
//     } catch (error) {
//         console.log("Authorization error:", error);
//         return res.status(401).json({ message: "Unauthorized User" });
//     }
// }

// const isAdmin = (req, res, next) => {
//     try {
//         // if (req.user && req.user.role === sha256Hash("admin")) {
//         if (req.user && compareHash("admin", req.user.role)) {
//             console.log("Admin authenticated successfully");
//             next();
//         } else {
//             console.log("Unauthorized Admin");
//             return res.status(403).json({ message: "Access denied: Admins only" });
//         }
//     } catch (error) {
//         console.log("Authorization error:", error);
//         return res.status(401).json({ message: "Unauthorized Admin" });
//     }
// };

// const isClerk = (req, res, next) => {
//     try {
//         // if (req.user && req.user.role === sha256Hash("clerk")) {
//         if (req.user && compareHash("clerk", req.user.role)) {
//             console.log("clerk authenticated successfully");
//             next();
//         } else {
//             console.log("Unauthorized clerk");
//             return res.status(403).json({ message: "Access denied: clerk role required" });
//         }
//         console.log("clerk authenticated successfully");
//         next();
//     } catch (error) {
//         console.log("Authorization error:", error);
//         return res.status(401).json({ message: "Unauthorized clerk" });
//     }
// };

// export { isAuthenticated, isUser, isAdmin, isClerk };
