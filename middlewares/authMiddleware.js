const jwt = require("jsonwebtoken")
const User = require("../models/UserModel")

// Middleware to check if user is logged in
const isLoggedIn = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;

        // If token doesn't exist -> User is not logged in
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const decoded_user = jwt.verify(token, process.env.JWT_SECRET);

        // Get the decoded user details from the database
        // ! Without Password
        const user = await User.findOne({ email: decoded_user.email }).select("-password");

        // If token is valid but user doesn't exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found"
            });
        }

        // Attach user to request for next middleware to access it
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

// Middleware to check if user has the required role
const requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }
        next();
    };
};

module.exports = {
    isLoggedIn,
    requireRole
};
