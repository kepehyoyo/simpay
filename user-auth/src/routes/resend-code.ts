import express, {Response,Request} from 'express';
import bodyParser from 'body-parser';
//import { ensureLoggedIn } from 'connect-ensure-login';
import twilio from 'twilio';
//import logger from '../../logger';


//const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
const TWILIO_ACCOUNT_SID =  "AC60101d43434ad308527ebbd6850966e9";
const TWILIO_AUTH_TOKEN = "63dd5bf3f685cc065378a4e140cedc6b";
const VERIFICATION_SID = "VA74fdf3392050a83ce8f5a9aa1782ef64";
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !VERIFICATION_SID) {
  console.error('Twilio credentials and service SID not set in environment variables.');
  process.exit(1);
} 

const router = express.Router();


router.post('/api/user-auth/resend-code', async (req, res) => {
  const { phoneNumber } = req.body;
 const verifyphoneNumber= `+${phoneNumber}`;
 console.log(verifyphoneNumber);

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  try {
    const verification = await client.verify.v2.services(VERIFICATION_SID)
      .verifications
      .create({ to: verifyphoneNumber, channel: 'sms' });
    res.status(200).json({ success: true, message: 'Verification code sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error sending verification code.' });
  }
});
 /*
router.get('/', 
  //  ensureLoggedIn(), 
    async (req: Request, res: Response) => {
      
 if (req.user.role !== 'access secret content') {
    const errors = { wasValidated: false };
    const channel = req.user.verificationMethod;
    let verificationRequest;

    try {
      verificationRequest = await twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        .verify.v2.services(VERIFICATION_SID)
        .verifications
        .create({ to: req.user.phoneNumber, channel });
    } catch (e) {
      logger.error(e);
      return res.status(500).send(e);
    }

    logger.debug(verificationRequest);

    return res.render('verify', { title: 'Verify', user: req.user, errors });
  }

  throw new Error('User already has `access secret content` role.');
});
  */
/* router.post('/', 
   // ensureLoggedIn(), 
    async (req: Request, res: Response) => {
  const { verificationCode: code } = req.body;
  let verificationResult;
  const errors = { wasValidated: true };

  try {
    verificationResult = await twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
      .verify.v2.services(VERIFICATION_SID)
      .verificationChecks
      .create({ code, to: req.body.phoneNumber });
  } catch (e) {
  //  logger.error(e);
    return res.status(500).send(e);
  }

  //logger.debug(verificationResult);

  if (verificationResult.status === 'approved') {
   // req.user.role = 'access secret content';
   //  await req.user.save();
    return res.redirect('/');
  }

  errors.verificationCode = `Unable to verify code. status: ${verificationResult.status}`;
  return res.render('verify', { title: 'Verify', user: req.user, errors });
}); */

 

export { router as resendCodeRouter}