import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Configure nodemailer with your existing transporter settings
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'a60518cd87e9fc', // Using your existing Mailtrap credentials
    pass: '010eeb28124d2a',
  },
});

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP endpoint
export const requestOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in user document with expiration time (10 minutes)
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send OTP via email
    await sendOTPEmail(user.email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      userId: user._id
    });
  } catch (error) {
    console.error('Error in requestOTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// Verify OTP endpoint
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Return success to proceed with login
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      userId: user._id,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

// Helper function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: 'UBheat <no-reply@ubheat.com>',
    to: email,
    subject: '🔐 Your UBheat Login OTP',
    text: `Your OTP for UBheat login is: ${otp}. It is valid for 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f4f4f4;">
        <div style="max-width: 600px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: auto;">
          <h2 style="color: #333;">UBheat Login Verification 🔐</h2>
          <p style="font-size: 16px; color: #555;">Your one-time password for login verification:</p>
          <div style="background-color: #f0f0f0; padding: 12px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #888;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};