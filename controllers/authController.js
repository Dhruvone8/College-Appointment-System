const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const handleRegistration = async (req, res) => {

    // Extract data from request body
    const { name, email, password, role } = req.body

    try {
        // Validate Input
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exists
        let userExists = await User.findOne({ email })

        // Return error message if user exists
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "User already exists. Try logging in."
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        let newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "student"
        })

        if (!newUser) {
            return res.status(500).json({ message: "Failed to create user" })
        }

        // Generate Token
        let token = jwt.sign({
            email: newUser.email, id: newUser._id, role: newUser.role
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        // Set Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during registration"
        });
    }
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    try {

        // Validate User Input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Check whether email user exists in the database
        let userExist = await User.findOne({ email })

        // If user doesn't exists
        if (!userExist) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email Or Password"
            });
        }

        // Verify Password
        const isPasswordMatch = await bcrypt.compare(password, userExist.password);

        // If Password Is Incorrect
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email Or Password"
            });
        }

        // Generate Token
        let token = jwt.sign({
            email: userExist.email,
            id: userExist._id,
            role: userExist.role
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        // Set Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            name: userExist.name,
            email: userExist.email,
            role: userExist.role,
            token
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login"
        });
    }
}

module.exports = {
    handleRegistration,
    handleLogin
}