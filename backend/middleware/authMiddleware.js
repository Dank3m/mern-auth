import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt; //get the token from cookie
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify that the token hasn't expired or been tampered with
      req.user = await User.findById(decoded.userId).select("-password"); //Find user by id and select only email and name
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
