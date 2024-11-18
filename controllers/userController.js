import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
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

export const register = async (req, res) => {
    try {
        const { fullName, username, email, password, confirmPassword, gender, role } = req.body;
        if (!fullName || !username || !email || !password || !confirmPassword || !gender || !role) {
            console.log("All fields are required");
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            console.log("Password does not match");
            return res.status(400).json({ message: "Password does not match" });
        }
        const user = await User.findOne({ username });
        if (user) {
            console.log("Username already exists. Try another username");
            return res.status(400).json({ message: "Username already exists. Try another username" });
        }
        const hashedFullname = sha256Hash(fullName);
        const hashedUsername = sha256Hash(username);
        const hashedEmail = sha256Hash(email);
        const hashedPassword = sha256Hash(password);
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const hashedMaleProfilePhoto = sha256Hash(maleProfilePhoto);
        const hashedFemaleProfilePhoto = sha256Hash(femaleProfilePhoto);

        await User.create({
            fullName: hashedFullname,
            username: hashedUsername,
            email: hashedEmail,
            password: hashedPassword,
            profilePhoto: gender === "male" ? hashedMaleProfilePhoto : hashedFemaleProfilePhoto,
            gender,
            role
        })
        console.log("User created successfully");
        return res.status(201).json({ message: "User created successfully", success: true });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            console.log("All fields are required");
            return res.status(400).json({ message: "All fields are required" });
        }
        const hashedUsername = sha256Hash(username);

        const user = await User.findOne({ username: hashedUsername });

        if (!user) {
            console.log("Invalid credentials");
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }
        const isPasswordCorrect = compareHash(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Invalid credentials");
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }
        const tokenData = { userId: user._id, role: user.role };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log("Logged In Successfully");
        return res.status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                userId: user._id,
                fullName: user.fullName,
                username: user.username,
                profilePhoto: user.profilePhoto,
                gender: user.gender,
                role: user.role,
             });

    } catch (error) {
        console.log("Login error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const logout = async (req, res) => {
    try {
        if(!req.cookies.token){
            console.log("No LoggedIn User");
            return res.status(401).json({ message: "No LoggedIn User" });
        }
        console.log("Logged Out Successfully");
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        console.log(error);
    }
}

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUser = req.id;
        console.log("loggedInUser", loggedInUser);
        const otherUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}