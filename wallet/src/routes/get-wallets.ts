

import { validateRequest } from '@cygnetops/common-v2';
import express,{ Request, Response } from 'express';

import { Wallet } from '../models/wallet';

const router = express.Router();

router.get('/api/wallets', async (req: Request, res: Response) => {
    try {
      // Retrieve all wallets from the database
      const wallets = await Wallet.find();
  
      // Send the wallets as a JSON response
      res.json(wallets);
    } catch (error) {
      // Handle any errors that occur during the database query
      console.error('Failed to retrieve wallets:', error);
      res.status(500).json({ error: 'Failed to retrieve wallets' });
    }
  });

  export {router as fetchAllWalletsRouter}