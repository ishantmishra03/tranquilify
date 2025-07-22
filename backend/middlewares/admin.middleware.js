export const verifyAdmin = (req, res, next) => {
  const isAuth = req.cookies?.token;

  if (!isAuth) {
    return res.status(401).json({ success: false, message: "Unauthorized - Admin only" });
  }

  next();
};
