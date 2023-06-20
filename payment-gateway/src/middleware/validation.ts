import { Request, Response, NextFunction } from 'express';

// Define the validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Perform request payload validation here
    // You can use a validation library like 'Joi' or 'Yup' to define validation schemas

    // Example validation using 'Joi'
    const Joi = require('joi');

    // Define the schema for validating the request body
    const schema = Joi.object({
      acquirerCountryCode: Joi.string().required(),
      acquiringBin: Joi.string().required(),
      amount: Joi.number().required(),
      // Define validation rules for other fields in the request body
    });

    // Validate the request body against the schema
    const { error } = schema.validate(req.body);

    if (error) {
      // Return a 400 Bad Request response with the validation error details
      return res.status(400).json({ error: error.details[0].message });
    }

    // If the validation passes, move to the next middleware
    next();
  } catch (error) {
    console.error('Error validating request:', error);
    res.status(500).json({ error: 'An error occurred while validating the request.' });
  }
};
