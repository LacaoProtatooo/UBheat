import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/mailer.js';
import cloudinary from 'cloudinary';
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Do NOT hash the password here—pass it in plain text.
    user = new User({
      firstName,
      lastName,
      email,
      password, 
      verificationToken,
      isActive: false,
      activationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });

    await user.save();

    // JWT
    generateTokenAndSetCookie(res, user._id);

    const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationLink);

    res.status(201).json({ message: 'Signup successful! Please check your email to verify your account.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Signup failed. Please try again.' });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.isActive || user.activationExpires < Date.now()) {
      return res.status(403).json({ msg: 'Your account is not active. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    const userid = user._id;
    // JWT
    generateTokenAndSetCookie(res, userid);

    user.activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Extend activation expiry to 24 hours from now
    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, isActive: user.isActive });
      }
    );

    res.status(200).json({
      success: true,
      message: user.isAdmin ? "Logged in successfully as admin" : "Logged in successfully as user",
      user: {
          ...user._doc,
          password: undefined,
      },
  });
  
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
      success: true,
      message: "Logged out successfully"
  });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token.' });
    }

    if (user.activationExpires < Date.now()) {
      user.isActive = false;
      await user.save();
      return res.status(400).json({ message: 'Verification token expired. Please sign up again.' });
    }

    user.isVerified = true;
    user.isActive = true; // Set to true upon successful verification
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Email verification failed. Please try again.' });
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

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const updateProfile = async (req, res) => {
  // Destructure only the fields that exist in your model
  const { userId, firstName, lastName, email } = req.body;
  const image = req.file;

  console.log("Image:", image);
  console.log("Request Body:", req.body);
  console.log("User ID:", userId);

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update only the fields available in your model
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    if (image) {
      // If a new image is provided, remove the old one (if exists) and upload the new image to Cloudinary.
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
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
};

