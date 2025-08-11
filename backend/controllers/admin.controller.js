import User from '../models/user.models.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (email !==ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  res.cookie("adminAuth", true, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, 
  });

  return res.status(200).json({ success: true, message: "Logged in successfully" });
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};
