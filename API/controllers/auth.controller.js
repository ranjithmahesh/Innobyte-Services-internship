import User from "../models/auth.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";

const sendVerificationEmail = async (email, verificationToken, name) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure the email service or SMTP details here
    service: "gmail",
    auth: {
      user: "ranjithsm459@gmail.com",
      pass: "hpakqwyriybyabgv",
    },
  });

  // Compose the email message
  const mailOptions = {
    from: "amazon.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email http://localhost:5000/auth/verify/${verificationToken} You email ${name}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log("Email already registered:", email); // Debugging statement
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const newUser = new User({ username: name, email, password, mobile });

    // Generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the user to the database
    await newUser.save();

    // Debugging statement to verify data
    console.log("New User Registered");

    sendVerificationEmail(
      newUser.email,
      newUser.verificationToken,
      newUser.name
    );

    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
};
export const VerifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    //Find the user witht the given verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    //Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email Verificatioion Failed" });
  }
};

const generatesecrectKey = () => {
  const secrectKey = crypto.randomBytes(32).toString("hex");
  return secrectKey;
};
const secrectKey = generatesecrectKey();
const generateOTP = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    alphabets: false, // Exclude lowercase alphabets as well
  });
  return otp;
};

// ///

const sendOTP = async (email, otp) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure the email service or SMTP details here
    service: "gmail",
    auth: {
      user: "ranjithsm459@gmail.com",
      pass: "hpakqwyriybyabgv",
    },
  });

  // Compose the email message
  const mailOptions = {
    from: "Task.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP Sent to Email");
  } catch (error) {
    console.error("Error sending OTP to email:", error);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user Not found" });
    }
    if (user && !user.verified) {
      return res.status(403).json({ message: "user email not verifed" });
    }

    // Check if the password is correct (consider using bcrypt for password hashing)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate and save OTP
    const OTP = generateOTP();

    user.otp = OTP;
    await user.save();

    // Send OTP via email
    sendOTP(email, OTP);

    // Generate a JWT token (uncomment and implement this part)
    const token = jwt.sign({ userId: user.email }, secrectKey);

    // Return OTP (for testing purposes; replace with token in production)
    console.log(token);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login Failed" });
  }
};

export const otpVerify = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });

    const otp = user.otp;

    res.status(200).json({ otp });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UserInfo = async (req, res) => {
  try {
    const { email } = req.query; // Use req.query to access query parameters in a GET request

    console.log(email);
    const user = await User.findOne({ email });

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, username, mobile } = req.body;
    console.log(email, username, mobile);
    // Find the user by email
    const user = await User.findOne({ email });

    // Update the user's information
    if (user) {
      user.username = username || user.username;
      user.mobile = mobile || user.mobile;

      // Save the updated user
      await user.save();

      res
        .status(200)
        .json({ message: "User information updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await user.deleteOne(); // Use deleteOne instead of remove

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
};
