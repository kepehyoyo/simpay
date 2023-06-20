"use strict";
/* Get Wallet Limits: This API endpoint retrieves the maximum and minimum limits for various wallet transactions such as adding money, transferring money, and withdrawing money.
Endpoint: /api/wallet/limits
Method: GET
Request Body: { "walletId": "wallet123" }
Response Body: { "limits": { "maxAddMoneyLimit": 50000, "minAddMoneyLimit": 1, "maxTransferLimit": 10000, "minTransferLimit": 1, "maxWithdrawLimit": 5000, "minWithdrawLimit": 10 } } */ 
