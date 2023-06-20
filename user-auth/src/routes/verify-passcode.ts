import express, { Request, Response,NextFunction } from "express";
import { body } from "express-validator";
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@cygnetops/common-v2";

import { Password } from "../services/password";
import { User,UserDoc } from "../models/user";

const router = express.Router();

// Passport.js local authentication strategy
passport.use(new LocalStrategy(
  { usernameField: 'phoneNumber' },
  async (phoneNumber: string, password: string, done: any) => {
    try {
      const user = await User.findOne({phoneNumber});
      if (!user) {
        return done(null, false, { message: 'Incorrect phone number or password' });
      }
      const isPasswordValid = await user.checkPassword(password);
      if (!isPasswordValid) {
        return done(null, false, { message: 'Incorrect phone number or password' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// JWT token generation
function generateToken(user: UserDoc) {
    const payload = { id: user.id, phone: user.phoneNumber };
    const secret = process.env.JWT_KEY || 'secret';
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, secret, options);
  }
  
router.post(
  "/api/user-auth/verify-passcode",
  [
    body("phoneNumber").isString().withMessage("Phone number must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, password } = req.body;
      const user = await User.findOne({ phone: phoneNumber });
      if (!user) {
        return res.status(401).json({ message: 'Incorrect phone number or password' });
      }
      if (user) {
        // Authenticate using password if phone number is verified
        passport.authenticate('local', { session: false }, (error: any, user: any) => {
          if (error) {
            return next(error);
          }
          if (!user) {
            return res.status(401).json({ message: 'Incorrect phone number or password' });
          }
          const token = generateToken(user);
          return res.status(200).send({user,token});
          //return res.header('Authorization', 'Bearer ' + token).json({ message: 'Logged in successfully' });
       
        })(req, res, next);
      } 
    } catch (error) {
      return next(error);
    }
  }
);


export { router as verifyPassCodeRouter };
