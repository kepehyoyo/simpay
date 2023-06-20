"use strict";
/* Set Wallet Limits: This API endpoint allows the user to set custom limits for various wallet transactions such as adding money, transferring money, and withdrawing money.
Endpoint: /api/wallet/set-limits
Method: PUT
Request Body: { "walletId": "wallet123", "limits": { "maxAddMoneyLimit": 100000, "minAddMoneyLimit": 100, "maxTransferLimit": 50000, "minTransferLimit": 100, "maxWithdrawLimit": 10000, "minWithdrawLimit": 100 } }
Response Body: { "walletId": "wallet123", "limits": { "maxAddMoneyLimit": 100000, "minAddMoneyLimit": 100, "maxTransferLimit": 50000, "minTransferLimit": 100, "maxWithdrawLimit": 10000, "minWithdrawLimit": 100 } }
 */ 
