import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  try {
    // Retrieve all tickets from the database
    const tickets = await Ticket.find();

    res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as ticketsRouter };
