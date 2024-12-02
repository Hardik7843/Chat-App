import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'

export const protectedView = async (req, res, next) => {
    try {
      const token = req.cookies.jwt;
  
      if (!token) {
        return res.status(401).json({ message: "Unauthorized - No Token Provided" });
      }
  
      try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
      }
      catch (err) {
        console.log("Error while decoding JWT token", err.message)
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
      }
  
      const user = await User.findById(decoded.userId).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      req.user = user;
  
      next();
    } catch (error) {
      console.log("Error in protectRoute middleware: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };