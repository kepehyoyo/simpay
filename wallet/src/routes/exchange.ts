//users to exchange currencies within their wallet (POST)
/* 
Exchange Currency: This API endpoint allows the user to exchange currency in their digital wallet, converting one type of currency to another.
Endpoint: /api/wallet/exchange-currency
Method: POST
Request Body: { "walletId": "wallet123", "fromCurrency": "USD", "toCurrency": "INR", "amount": 100 }
Response Body: { "walletId": "wallet123", "fromCurrency": "USD", "toCurrency": "INR", "amount": 7000 } */