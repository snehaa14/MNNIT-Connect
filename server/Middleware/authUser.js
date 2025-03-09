import jwt from "jsonwebtoken";
import userModel from '../Models/UserModel'

const auth = async (req, res, next) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return res.json({ message: "Unauthorized Access: No token." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
      return res.json({ message: "Unauthorized Access: Invalid token." });
    }


    const response = await userModel
      .findById(decodedToken.id)
      .select("-password");
    if (!response) { return res.json({ message: "User not found." });  }

    req.user = {
      ...response.toObject(),
      isOwner: true, 
    };
    next();
  }
   catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default auth;
