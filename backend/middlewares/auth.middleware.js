import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.id) {
      req.userId = decoded.id;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error?.message || 'An error occurred during authentication.',
    });
  }
};
