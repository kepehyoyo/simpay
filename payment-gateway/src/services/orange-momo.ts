import axios, { AxiosResponse } from 'axios';

// Function to request a top-up using the Orange Mobile Money API
async function requestTopUp(phoneNumber: string, amount: number): Promise<void> {
  const apiUrl = 'https://api.orange.com/orange-money-webpay';

  try {
    // Make an HTTP POST request to the top-up endpoint
    const response: AxiosResponse = await axios.post(`${apiUrl}/api/v1/request-top-up`, {
      phoneNumber,
      amount,
      currency: 'XAF' // Adjust the currency as per your requirements
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Replace with your Orange Mobile Money API access token
        'Content-Type': 'application/json'
      }
    });

    // Handle the response from the Orange Mobile Money API
    if (response.status === 200) {
      console.log('Top-up request successful');
    } else {
      console.log('Top-up request failed');
    }
  } catch (error) {
    console.error('Error requesting top-up:', error);
  }
}

// Example usage
requestTopUp('237690000001', 5000);
