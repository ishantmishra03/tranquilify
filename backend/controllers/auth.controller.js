import User from '../models/user.models.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Invalid email or password' });

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
    });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

const isAuthenticated = async (req, res) => {
  try {
    res.json({ success: true, message: 'Authenticated' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

export { signup, login, logout, isAuthenticated };
