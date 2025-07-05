import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  const payload = { id: user._id };
  const expiresIn = '1d';
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export default generateToken;
