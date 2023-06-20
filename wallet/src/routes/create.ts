/* Create Wallet: This API endpoint creates a digital wallet for the user to store and manage their digital money.
Endpoint: /api/wallet/create
Method: POST
Request Body: { "userId": "user123" }
Response Body: { "walletId": "wallet123", "userId": "user123" } */

import express, {Response,Request} from 'express';
import {body} from 'express-validator';
import { Wallet } from '../models/wallet';
import  jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@cygnetops/common-v2';
import { v4 as uuidv4 } from 'uuid';
import { CreateWalletPublisher } from '../events/publishers/wallet-created-publisher';
import { KafkaProducer } from '../events/kafka-producer';
import { CreateWalletEvent } from '../events/create-wallet-event';
import { createWallet, createWalletwithId } from '../services/wallet-service';

 
const router = express.Router();

router.post("/api/wallet/create",[
        //Validate the user id parameter
      body("user_id").notEmpty().withMessage("User ID is required"),
      body("currency")
      .notEmpty()
      .isIn(["XAF", "EUR", "GBP","USD"])
      .withMessage("Invalid currency"),
    ] ,
    validateRequest,
    async(req:Request,res:Response)=>{
            

            // Extract user ID from JWT
            /* const authHeader = req.headers.authorization;
            const token = authHeader?.split(' ')[1];
            const decodedToken = jwt.decode(token!);
            const userId = decodedToken?.sub; */


            const { user_id ,currency} = req.body;
            
        
       /*     const existingWallet = await Wallet.findOne({user_id})

            if(existingWallet){
              throw new BadRequestError('user already has wallet')
            }
  */
               // Create a new wallet with default balance of 0
             const wallet_id:string = uuidv4(); 
           
           //  const wallet =  Wallet.build({wallet_id,user_id,balance:0 ,currency})
              
            try {
            //  const token = jwt.sign({ wallet_id }, process.env.JWT_KEY!);
              const wallet = await createWalletwithId(wallet_id,user_id,1000,currency)


              // Publish walletCreated event to Kafka topic 
              const kafkaProducer = new KafkaProducer(); 
              const createWalletEvent = new CreateWalletEvent({walletId:wallet_id,balance:wallet.balance,currency});
              const createWalletPublisher = new CreateWalletPublisher(kafkaProducer);
              await createWalletPublisher.publish(createWalletEvent); 
 
             // res.status(201).json({ wallet_id, balance: 0, token });
              res.status(201).json({ wallet_id, balance: 0 });
            } catch (err) {
              console.error("Error creating wallet:", err);
              res.status(500).json({ message: "Server error" });
            }
          //  res.status(201).send(wallet);
       
           }
        );

export {router as createWalletRouter};