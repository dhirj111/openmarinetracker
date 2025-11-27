const User = require('../models/user.js');
const jwt = require('jsonwebtoken')
const { z } = require('zod');

//Validation Schemas------------------------------------

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  // Enforce strong passwords (min 8 chars, 1 uppercase, 1 number)
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

//jwt helper function-------------------
const generateToken = (userId) => {

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

//usercontollers
exports.register = async (req, res) => {
  try {
    // Validate Input using Zod safely
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      const errorMessages = validation.error.issues.map((e) => e.message);
      return res.status(400).json({ message: 'Validation Error', errors: errorMessages });
    }

    // Deconstruct verified data
    let { name, email, password } = validation.data;
    email = email.toLowerCase().trim();

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    //  set jwt in http-only cookie
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email },
      token   
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {

  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    let { email, password } = validation.data;
    email = email.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    // set jwt in http-only cookie
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
