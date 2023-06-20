import express, { Request, Response } from "express";
import { body } from "express-validator";
import passport from "passport";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { validateRequest, BadRequestError } from "@cygnetops/common-v2";
import { KafkaProducer } from "../events/kafka-producer";
import { User } from "../models/user";
import { CreateUserEvent } from "../events/user-auth-events";
import { CreateUserPublisher } from "../events/publishers/user-auth-publisher";
import { Info } from "../models/info";

const router = express.Router();

router.post(
  "/api/user-auth/signup",
  [
    body("firstName")
      .isString()
      .notEmpty()
      .withMessage("First Name is required"),
   body("middleName")
      .isString()
      .withMessage("First Name is must be string"),
   body("lastName")
      .isString()
      .notEmpty()
      .withMessage("Last Name is required"),
    body("phoneNumber").isNumeric().withMessage("PhoneNumber must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 6 })
      .withMessage("Password must be between 4 and 6 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { firstName,middleName,lastName,phoneNumber, password } = req.body;
    console.log(`${firstName} ${middleName} ${lastName} is to be created with phonenumber ${phoneNumber} and password ${password}`)
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      throw new BadRequestError("User already exists");
    }
    const userId = uuidv4();
    const user =   User.build({userId, phoneNumber, password });
    const userInfo = Info.build({userId,firstName,middleName,lastName})
    try{
      await user.save();
      await userInfo.save();
      // Publish CreateUser event to Kafka topic 
      const kafkaProducer = new KafkaProducer(); 
      const createUserEvent = new CreateUserEvent({userId:user.userId,
                                          phoneNumber:user.phoneNumber,
                                          firstName:userInfo.firstName,
                                          middleName:userInfo.middleName ??'',
                                          lastName:userInfo.lastName});
      const createUserPublisher = new CreateUserPublisher(kafkaProducer);
      await createUserPublisher.publish(createUserEvent); 

      // Authenticate user with passport and JWT
    /*   req.login(user, { session: false }, async (error) => {
        if (error) {
          console.error("Error logging in user", error);
          return res.status(500).json({ message: "Server error" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY!);
        res.status(201).send({ user,userInfo,token });
      }); */
      res.status(201).send({ user,userInfo });
    } catch (err) {
      console.error("Error creating user", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export { router as signupRouter };
