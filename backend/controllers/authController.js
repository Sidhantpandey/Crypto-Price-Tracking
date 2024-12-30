import { asyncHandler } from "../utils/asyncHandler.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists" });
    }
    // if user with the email id dont exists then we encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating new user for the database
    // remember we will provide name and other details not default values
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    // now generate tokens which we will send it to the user using the cookies
    // we will provide token id, secretkey, expiry time
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // we will send token via cookie, 1st ->name ,2nd->value
    res.cookie("token", token, {
      httpOnly: true,
      // if nodeenv=production then its true otherwise return false
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 1000,
    });
    // after setting this token in the cookie we will add email wala part of nodemailer

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our website",
      text: `Hello ${name},Welcome to our website. We are glad to have you here. Your account have been created with email id ${email}`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "User Registered Successfully" });

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and Password is Required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Email Id Not Valid" });
    }
    //if user exists in the body then we will check for password
    // 1st we will have to compare password from the database encrypted one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Password Not Valid " });
    }
    // generate one token using this user will be logged in
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // we will send token via cookie, 1st ->name ,2nd->value , options
    res.cookie("token", token, {
      httpOnly: true,
      // if nodeenv=production then its true otherwise return false
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 1000,
    });
    // now user is successfull logged in
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

const logout = asyncHandler(async (req, res) => {
  // we have to clear cookie from response
  try {
    res.clearCookie("token", {
      httpOnly: true,
      // if nodeenv=production then its true otherwise return false
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
      maxage: 7 * 24 * 60 * 1000,
    });

    return res.json({ success: true, message: "Logged Out Whohooo!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

const sendVerifyOtp = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already Verified" });
    }
    // if account is not verified then we will send otp to the email id
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    // now we have to set expiry time for otp
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP`,
    };
    await transporter.sendMail(mailOption);
    res.json({ success: true, message: "The OTP has been send" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Verify email using Otp
const verifyEmail = asyncHandler(async (req, res) => {
  // we need user id and otp to verify it

  // note that how the user will send user id? it can send OTP only
  // we will do it using a middleware ->that will get the cookie -> get the token->get the userid

  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User does not Exists" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      // it means its already expired
      return res.json({ success: false, message: "OTP Expired" });
    }
    // if Otp not expired
    // we will verify useraccount, so we have to make useraccountverify wala thing true in database

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email Verified Succesfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

//Check if user is Authenticated or not
const isAuthenticated = asyncHandler(async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Send Password Reset Otp
const sendResetOtp = asyncHandler(async (req, res) => {
  // we will check via email
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is Required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    //suppose user is avaiable with the entered email id we will send otp via email and save it in a database

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    // Now we have to set expiry time for otp
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 60 * 1000; //15 minutes
    await user.save();
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password`,
    };

    await transporter.sendMail(mailOption);
    res.json({ success: true, message: "The OTP has been send to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

// now a controller function where user can verify otp and reset the passord
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email ,OTP and New Password is Required",
    });
  }
  //first find user using email
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }
    // if OTP has not expired so we will have to take that password from the user and encrypt it to save in database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    res.json({
      success: true,
      message: "Password has been Updated Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

export {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword
};
