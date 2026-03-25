const User = require("../model/UserModel");
const { createSecretToken } = require("../utils/secretToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    if(!email){
      return res.json({message:"Email is required"});
    }
    if(!username){
      return res.json({message:"Username is required"});
    }
    if(!password){
      return res.json({message:"Password is required"});
    }
  // const hashedPassword = await bcrypt.hash(password, 10);
const user = await User.create({ 
  email, 
  password, 
  username, 
  createdAt 
});
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Incorrect email' });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: 'Incorrect password or email' });
    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports.CurrentUser = async (req, res) => {
  try { 
    const user = await User.findById(req._userId)
    .select("-password"); 
    if (!user) { 
      return res.status(404).json({ status: false, message: "User not found" });
     } 
    //  res.json({ status: true, user });

    return res.status(200).json({
      status: true,
      user
    });

  } catch (error) { res.status(500).json({ status: false, message: "Server error" }); }
};

module.exports.Logout =async(req,res)=>{
  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
}); 
  return res.json({ status: true, message: "Logged out successfully" });
};