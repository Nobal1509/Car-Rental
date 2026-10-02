import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    let token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message: "not authorized"})
    }
    if (typeof token === 'string' && token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
    }
    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.json({success: false, message: "not authorized"})
        }

        const userId = typeof decoded === 'object' && decoded.id ? decoded.id : decoded;
        req.user = await User.findById(userId).select("-password")
        if (!req.user) {
            return res.json({success: false, message: "not authorized"})
        }
        next();
    } catch (error) {
        return res.json({success: false, message: "not authorized"})
    }
}