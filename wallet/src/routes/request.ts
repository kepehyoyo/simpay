//send payment requests to other users or merchants(POST)

/* Request Payment: This API endpoint allows the user to request payment from another user.
Endpoint: /api/wallet/request-payment
Method: POST
Request Body: { "walletId": "wallet123", "requesteeId": "requestee789", "amount": 100, "description": "Request for payment of loan" }
Response Body: { "walletId": "wallet123", "requesteeId": "requestee789", "amount": 100, "description": "Request for payment of loan", "requestId": "req123", "timestamp": "2023-03-10T12:00:00Z" } */