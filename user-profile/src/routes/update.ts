import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@cygnetops/common-v2";
import { KafkaProducer } from "../events/kafka-producer";;
//import { CreateUserEvent } from "../events/user-profile-events";
//import { CreateUserPublisher } from "../events/publishers/user-auth-publisher";
import { UserProfile, UserProfileAttrs } from "../models/profile";
import { UserProfileService } from "../services/user-profile-service";

 
 
const router = express.Router();
const userProfileService = new UserProfileService();

router.put(
    '/api/user-profile/users/:userId',
    [
      body('firstName').isString().notEmpty(),
      body('middleName').isString().optional(),
      body('lastName').isString().notEmpty(),
      body('phoneNumber').isString().notEmpty(),
      body('avatar').isString().optional(),
      body('coverPhoto').isString().optional(),
      body('aboutMe').isString().optional(),
      body('contactInfo').isString().optional(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const {
        firstName,
        middleName,
        lastName,
        phoneNumber,
        avatar,
        coverPhoto,
        aboutMe,
        contactInfo,
      } = req.body;
  
      try {
        const updatedProfile: UserProfileAttrs = {
          userId,
          firstName,
          middleName,
          lastName,
          phoneNumber,
          avatar,
          coverPhoto,
          aboutMe,
          contactInfo,
          updatedAt: new Date(),
        };
  
        const userProfile = await userProfileService.updateUserProfile(
          userId,
          updatedProfile
        );
  
       // res.status(200).send(userProfile);
       res.status(200).json({userId:userId,firstName:firstName,middleName:middleName,lastName:lastName,phoneNumber:phoneNumber})
      } catch (err) {
        console.error("Error Updating User Profile", err);
        res.status(500).json({ message: "Server error" });
      }
    }
  );


  export {router as updateUserProfileRouter}
  