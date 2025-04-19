import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });
};

const loginUser = async (req, res) => 
  {
  try {
    // console.log("login API Working");
    const { email, password } = req.body;
    // console.log(req.body);
    if (!email || !password) 
      {
      return res.json({ success: false, message: "All fields are required." });
    }
    // console.log("email and password are " + email + " " + password);

    const user = await userModel.findOne({ email });
    // console.log("user is " + user._id);
    if (!user) {
      console.log("User does not exist.");
      return res.json({ success: false, message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log("isMatch is " + isMatch);

    if (!isMatch) { return res.json({ success: false, message: "Incorrect Password" }); }

    const token = createToken(user._id);
    // console.log("token is " + token);
    res.cookie("token", token, 
    {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, user, token, message: "Logged in successfully.", });
    // console.log("Logged in successfully.");
  } 
  catch (error) 
  {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const signupUser = async (req, res) => {
  try {
    // console.log("signup API Working");
    const { name, dob, email, username, password,program,  batch,  branch } = req.body;
    // console.log(req.body);

    if (!name || !dob || !email || !username || !password || !program || !batch || !branch) {
      // console.log("All fields are required.");
      return res.json({ success: false, message: "All fields are required." });
    }

    const mailExists = await userModel.findOne({ email });
    // console.log("mailExists is " + mailExists);

    if (mailExists) {
      return res.json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const usernameExists = await userModel.findOne({ username });
    // console.log("usernameExists is " + usernameExists);

    if (usernameExists) {
      return res.json({ success: false, message: "Username is taken." });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    const newUser = new userModel({  name,  dob,  email,  username,  password: hashedPassword,  program,  batch,  branch,  role: "user", });
    // console.log("newUser is " + newUser._id);
    //console.log("he he");

    const user = await newUser.save();

    const token = createToken(user._id);

    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Account created successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("user");
  res.json({ success: true, message: "User logged out succesfully." });
};


export { loginUser, signupUser, logoutUser };
