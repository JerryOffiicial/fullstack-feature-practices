import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: " All fields are required" });
  }
  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassowrd = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassowrd });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Successfuly Account Created" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: "Email and Password are required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //true -sent only over https, else over http
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // strict- only from same site, else across different domains
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days
    });

    return res.json({ success: true, message: "Successfully Login" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Send Verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req;

    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account is already verified." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP`,
    };
    await transporter.sendMail(mailOption);

    res.json({ success: true, message: "Verification OTP sent on Email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Verifying the email using the OTP
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const { userId } = req;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

//Check if user is authunticated
export const isAuthenticated = (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


//Send Password Reset OTP
export const sendResetOtp = async (req, res)=>{
  const {email} = req.body;

  if(!email){
    return res.status(400).json({success:false, message: "Email is required"});
  }

  try {
    const user = await userModel.findOne({email});

    if(!user){
      return res.status(404).json({success:false, message:"User not found."})
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 *1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Resetting OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetiing your password`,
    };

    await transporter.sendMail(mailOption);

    return res.json({success:true, message: "OTP sent to your email"});
  } catch (error) {
    return res.json({success: false, message: error.message});
  }
}

//Reset User Password
export const resetPassword = async (req, res)=>{
  const {email, otp, newPassword} = req.body;

  if(!email || !otp || !newPassword){
    return res.status(400).json({success:false, message: "Email, OTP, and new password are required"})
  }

  try {
    const user = await userModel.findOne({email});

    if(!user){
      return res.status(404).json({success:false, message: "User not found."})
    }

    if(user.resetOtp === "" || user.resetOtp !== otp){
      return res.status(400).json({success:false, message:"OTP is invalid."})
    }

    if(user.resetOtpExpireAt < Date.now()){
      return res.json({success:false, message: "OTP Expired"})
    }

    const hashedPassowrd = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassowrd;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({success: true, message:"Password has been reset successfully"})
  } catch (error) {
    
  }
}