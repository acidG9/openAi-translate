import jwt from 'jsonwebtoken';

const middleware = (req, res, next) => {
  let token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

export default middleware;