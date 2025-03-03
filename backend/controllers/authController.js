import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/mailer.js';

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const verificationToken = crypto.randomBytes(20).toString('hex');

    user = new User({
      firstName,
      lastName,
      email,
      password,
      verificationToken,
    });

    await user.save();

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
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ msg: 'Your account is not active. Please contact support.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Email verification failed. Please try again.' });
  }
};