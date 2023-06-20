import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    console.error('Error retrieving ticket:', error);
    res.status(500).json({ message: 'Error retrieving ticket' });
  }
});

export { router as showTicketRouter };
