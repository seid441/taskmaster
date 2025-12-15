const jwt =require('jsonwebtoken');
require("dotenv").config();
const authMiddleware=(req,res,next)=>{
  //frontend send token .It checks whether the request has a JWT token in the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if(!token){
    res.status(401).json({message:"No token, authorization denied"})
  }
  try {
    //then we verfiy the token that send from the frontend
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode; //we added the decoded user info to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
}