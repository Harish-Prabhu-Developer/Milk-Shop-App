import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateUser = (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ status: "fail", msg: "Access denied. Token missing or invalid." });
      }
  
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ status: "fail", msg: "Invalid or expired token." });
        }
  
        console.log("Decoded Token Data:", decoded);  // Debug log
        req.user = decoded; // Attach decoded user data
        next();
      });
  
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(500).json({ status: "fail", msg: "Internal server error", error: error.message });
    }
  };
  