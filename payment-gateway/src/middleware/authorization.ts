import { Request, Response, NextFunction } from 'express';

// Define a custom interface that extends the Request interface
interface AuthenticatedRequest extends Request {
  user: any; // Replace `any` with the actual type of your user object
}

// Define the authorizeUser middleware
export const authorizeUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Perform user authorization here
    // You can use any authorization mechanism or strategy based on your application's requirements

    // Example authorization check
    const user = req.user; // Access the user property from the request object

    // Check if the user has the necessary permissions to access the resource
    if (!user || !user.isAdmin) {
      // Return a 403 Forbidden response if the user is not authorized
      return res.status(403).json({ error: 'You are not authorized to access this resource.' });
    }

    // If the authorization passes, move to the next middleware
    next();
  } catch (error) {
    console.error('Error authorizing user:', error);
    res.status(500).json({ error: 'An error occurred while authorizing the user.' });
  }
};
