"use strict";
//payments to other users or merchants within the app (POST)
/*
Make Payment: This API endpoint allows the user to make a payment using the balance in their digital wallet.
Endpoint: /api/wallet/make-payment
Method: POST
Request Body: { "walletId": "wallet123", "payeeId": "payee456",
   "amount": 500, "description": "Payment for order #123" }
Response Body: { "walletId": "wallet123", "payeeId": "payee456",
   "amount": 500, "description": "Payment for order #123", "transactionId": "txn456", "timestamp": "2023-03-10T12:00:00Z" } */
/*
import express, {Response,Request} from 'express';
import {body} from 'express-validator';
import { PaymentRequest } from '../models/payment';
import { Wallet } from '../models/wallet';
import { BadRequestError, validateRequest } from '@cygnetops/common-v2';

import { v4 as uuidv4 } from 'uuid';


const validateRequestBody = [
    body('walletId').isString().notEmpty(),
    body('payeeId').isString().notEmpty(),
    body('amount').isNumeric().notEmpty(),
    body('description').isString().notEmpty()
  ];
 
const router = express.Router();

router.post("/api/wallet/make-payment",
         validateRequestBody,
         validateRequest,
         async(req:Request,res:Response)=>{
        
            const { walletId, payeeId, amount, description='payment of goods/services' } = req.body;
             
            const transaction_id = uuidv4();
            const timestamp = new Date().toISOString();
            
            const existingWallet = await Wallet.findOne({wallet_id})

            if(existingWallet){
              throw new BadRequestError('user already had wallet')
            }


            // Create a new wallet with default balance of 0
            const wallet =  Wallet.build({walletId,payeeId,amount,description,transaction_id,timestamp})
            await wallet.save();

            res.status(201).send(wallet);
       
           }
        );

export {router as createWalletRouter};  */ 
