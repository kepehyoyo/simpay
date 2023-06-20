"use strict";
/* class UssdController {
    async handleUssdRequest(req: Request, res: Response): Promise<void> {
      // parse USSD request from user
      const { sessionId, phoneNumber, text } = req.body;
  
      // get user's current session from session service
      const session = await UssdSessionService.getSession(sessionId, phoneNumber);
  
      // get user's last response
      const lastResponse = session.getLastResponse();
  
      // determine which USSD menu to display based on user's last response
      const menu = UssdMenuService.getMenu(lastResponse);
  
      // display menu to user and wait for response
      const response = await UssdMenuService.displayMenu(menu, text);
  
      // update user's session with latest response
      await UssdSessionService.updateSession(sessionId, phoneNumber, response);
  
      // send response to user
      res.send(response);
    }
  }
   */ 
