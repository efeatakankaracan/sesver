const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Extract the token from the request headers or query parameters
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify and decode the token using your secret key
    const decoded = jwt.verify(token, 'sesverle-sesimiveriyorum');

    // Attach the decoded payload to the request object for further use
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(403).json({ message: 'Forbidden' });
  }
}



async function checkUser(req, res, next) {
  // Extract the token from the request headers or query parameters
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify and decode the token using your secret key
    const decoded = jwt.verify(token, 'your-secret-key');

    // Check if the user exists in the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(403).json({ message: 'Forbidden' });
  }
}




module.exports = {authMiddleware, checkUser};
