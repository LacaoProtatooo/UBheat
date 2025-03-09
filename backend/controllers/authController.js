import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail, 
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../utils/emails.js";
import ErrorHandler from '../utils/errorHandler.js'; 
import { auth } from '../utils/firebase.js';
import cloudinary from '../utils/cloudinaryConfig.js';
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log("Request Body:", req.body);

  try {
    if (!firstName || !lastName || !email || !password) {
      throw new Error("All fields are required");
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      firstName, 
      lastName, 
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiry
      isActive: true,
    });
    await user.save();

    // Generate JWT and set cookie
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, user.verificationToken);
    res.status(201).json({
      success: true,
      message: "Signup successful! Please check your email to verify your account.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });

  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Signup failed. Please try again.' });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  console.log("Body:", req.body);

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Invalid or expired verification code");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.firstName);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: "Email not verified" });
    }
    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Your account is inactive. Please contact support." });
    }
    
    // Generate JWT and set cookie
    generateTokenAndSetCookie(res, user._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isAdmin ? "Logged in successfully as admin" : "Logged in successfully as user",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      setFieldError("email", err.response.data.message);
    } else {
      toast.error("Login failed. Please try again.");
    }
  }
  
};

export const googlelogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const email = decodedToken.email;

    let user = await User.findOne({ email });
    if (!user) {
      const fullName = decodedToken.name || "Google User";
      const [firstName, lastName = ""] = fullName.split(" ", 2);

      let username = fullName.replace(/\s+/g, "_").toLowerCase();
      let usernameExists = await User.findOne({ username });
      while (usernameExists) {
        username = `${username}_${crypto.randomBytes(3).toString("hex")}`;
        usernameExists = await User.findOne({ username });
      }

      // Generate a secure random password
      const randomPassword = crypto.randomBytes(8).toString("hex");

      // Create a new user if not found
      user = new User({
        username,
        firstName,
        lastName,
        email,
        password: randomPassword,
        isVerified: true,
      });

      await user.save();
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Your account is inactive. Please contact support." });
    }

    // Generate JWT and set cookie
    generateTokenAndSetCookie(res, user._id);
    
    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Google sign-in failed. Please try again.");
    }
  }
  
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

export const updateProfile = async (req, res) => {
  const { userId, firstName, lastName, email, phone } = req.body;
  const image = req.file;

  console.log("Image:", image);
  console.log("Request Body:", req.body);
  console.log("User ID:", userId);

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (image) {
      if (user.image?.public_id) {
        await cloudinary.uploader.destroy(user.image.public_id);
      }
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user_image" },
          (error, result) => {
            if (error) {
              reject(new Error("Error uploading avatar to Cloudinary"));
            } else {
              resolve(result);
            }
          }
        );
        stream.end(image.buffer);
      });

      user.image = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again." });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const users = await User.find().select('firstName lastName email isActive');
    const notifications = users.map(user => {
      if (user.isActive) {
        return { type: 'activated', message: `User account activated: ${user.firstName} ${user.lastName}`, timestamp: Date.now() };
      } else {
        return { type: 'deactivated', message: `User account deactivated: ${user.firstName} ${user.lastName}`, timestamp: Date.now() };
      }
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ message: 'Error fetching user notifications' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user ? req.user.id : null;
    const query = currentUserId ? { _id: { $ne: currentUserId } } : {};

    const users = await User.find(query);
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    next(new ErrorHandler("Error fetching users", 500));
  }
};


export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive, activationExpires } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive, activationExpires },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

