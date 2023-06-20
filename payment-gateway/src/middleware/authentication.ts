import { Request, Response, NextFunction } from 'express';

// Define the authenticateUser middleware
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Perform user authentication here
    // You can use any authentication mechanism or strategy based on your application's requirements

    // Example authentication using JWT
    const jwt = require('jsonwebtoken');
    const secretKey = 'your-secret-key';

    // Get the token from the request headers or query parameters
    const token = req.headers.authorization?.split(' ')[1] || req.query.token;

    if (!token) {
      // Return a 401 Unauthorized response if the token is missing
      return res.status(401).json({ error: 'Authentication token is missing.' });
    }

    // Verify and decode the token
    const decodedToken = jwt.verify(token, secretKey);

    // Optionally, you can perform additional checks or validations on the decoded token

    // Attach the authenticated user to the request object for further processing
    (req as any).user = decodedToken;

    // If the authentication passes, move to the next middleware
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'An error occurred while authenticating the user.' });
  }
};
