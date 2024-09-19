import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generateToken = (user) => {
     return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
          expiresIn: "30d",
     })
}

const protect = async (req, res, next) => {
     let token;
     if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer")
     ) {
          try {
               token = req.headers.authorization.split(" ")[1];
               const decoded = jwt.verify(token, process.env.JWT_SECRET);
               req.user = await User.findById(decoded.id);
               next();
          } catch (error) {
               console.error(error);
               res.status(401);
               throw new Error("Not authorized, token failed");
          }
     }
     if (!token) {
          res.status(401);
          throw new Error("Not authorized, no token");
     }
};

const admin = (req, res, next) => {
     if (req.user && req.user.isAdmin) {
          next();
     } else {
          res.status(401);
          throw new Error("Not authorized as an admin");
     }
};

export { generateToken, protect, admin }