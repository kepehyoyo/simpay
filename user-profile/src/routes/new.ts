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


router.post(
  '/api/user-profile/users/new',
  [
    body('userId').isString().notEmpty(),
    body('firstName').isString().notEmpty(),
    body('midlleName').isString().optional(),
    body('lastName').isString().notEmpty(),
    body('phoneNumber').isString().notEmpty(),
    body('avatar').isString().optional(),
    body('coverPhoto').isString().optional(),
    body('aboutMe').isString().optional(),
    body('contactInfo').isString().optional(),
  ], validateRequest,
  async (req: Request, res: Response) => {
   
      // Get the user profile details from the request body
      const { userId, firstName,middleName,lastName, phoneNumber, avatar, coverPhoto, aboutMe, contactInfo } = req.body;
     
   try{
          const userProfile = await userProfileService.createProfile(
            userId,
            firstName,
            middleName,
            lastName,
            phoneNumber,
            avatar,
            coverPhoto,
            aboutMe,
            contactInfo
          );

         // console.log(userProfile);
          res.status(201).send(userProfile);
 
         // Return the newly created user profile
      }catch(err){
        console.error("Error Creating User Profile",err);
        res.status(500).json({message:"Server error"})
      }
      
        // // Generate JWT
    // const userJwt = jwt.sign(
    //   {
    //     id: user.id,
    //     email: user.phoneNumber,
    //   },
    //   process.env.JWT_KEY!
    // );

    // // Store it on session object
    // req.session = {
    //   jwt: userJwt,
    // };
       
   
    }
  
);

export { router as createUserProfileRouter };
