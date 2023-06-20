//import axios from 'axios';


export class FraudService {
/* const FRAUD_API_KEY = 'your_fraud_detection_api_key_here';
 */
/* static async detectFraud(paymentAmount: number, paymentRecipient: string): Promise<boolean> {
const response = await axios.post(`https://fraud-detection-api.com/detect_fraud`, {
amount: paymentAmount,
recipient: paymentRecipient,
//api_key: FRAUD_API_KEY,
});

const isFraudulent = response.data.is_fraudulent;

    return isFraudulent;
}
 */
static async   checkForFraud(paymentAmount: number, paymentRecipient: string, paymentMethod: string): Promise<boolean> {
// Perform fraud detection checks, e.g., check if payment amount or recipient is associated with a known fraudster
// Return true if fraudulent activity is detected, false otherwise
    return false;
    }
}