import express, { Request, Response, query } from "express";
import {body, check, validationResult } from "express-validator"; 
import { User } from "../models/user";
import { Info } from "../models/info";
import { validateRequest } from "@cygnetops/common-v2";

const router = express.Router();

router.get(
  "/api/user-auth/check-exists",
  [
    check("phoneNumber").isNumeric().withMessage("PhoneNumber must be valid"), 
  ],
  validateRequest,
   // check('phoneNumber').isMobilePhone('any', { strictMode: true }).withMessage('Invalid phone number'),
   
  async (req: Request, res: Response) => {
    const { phoneNumber } = req.query;
    console.log("jkjhgfdf")
    try {
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
        console.log("user exists");
         const userInfo = await Info.findOne({ userId: existingUser.userId });
        return res.status(200).json({user:userInfo });
      } else {
        console.log("user does not exist");
        return res.sendStatus(404);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  }
);

export { router as checkUserExistsRouter };
