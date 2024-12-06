import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token;

	// Log to check token existence
	console.log('Token from cookies:', token);

	if (!token) {
		return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	}

	try {
		// Log to check the JWT_SECRET value
		console.log('JWT Secret:', process.env.JWT_SECRET);
		
		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Check if the token is valid
		if (!decoded) {
			return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
		}

		// Save user ID from token to the request object
		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.log("Error in verifyToken", error);

		// Handle specific JWT errors
		if (error instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ success: false, message: "Unauthorized - token expired" });
		} else if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
		}

		// Handle other server errors
		return res.status(500).json({ success: false, message: "Server error" });
	}
};
