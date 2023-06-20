import express, { Request, Response, Router } from "express";
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

router.get("/api/user-profile/users/:userId", async (req: Request, res: Response) => {
    const { userId } = req.params;

    console.log(userId)
    try {
      const userProfile = await userProfileService.getUserProfile(userId);
      if (!userProfile) {
        throw new BadRequestError("User profile not found");
      }
      
      
      res.status(200).json({userId:userProfile.userId,firstName:userProfile.firstName,middleName:userProfile.middleName,lastName:userProfile.lastName,phone:userProfile.phoneNumber});
    } catch (err) {
      console.error("Error Fetching User Profile", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  export {router as getUserProfileRouter}