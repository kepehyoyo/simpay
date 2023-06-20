import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError , currentUser} from "@cygnetops/common-v2";

import { checkWalletBalanceRouter } from "./routes/balance";
import { createWalletRouter } from "./routes/create";
import { addMoneyWalletRouter } from "./routes/add-money";
import { transferMoneyWalletRouter } from "./routes/transfer-money";
import { withdrawWalletRouter } from "./routes/withdraw";
import { transactionsWalletRouter } from "./routes/transactions";
import { KafkaTransactionConsumer } from "./events/listeners/transaction-consumers";
import { KafkaUserAuthConsumer } from "./events/listeners/user-auth-consumers";
import { checkUserWalletBalanceRouter } from "./routes/balance-with-userId";
import { checkWalletIDforUserRouter } from "./routes/wallet-with-userid";
import { fetchAllWalletsRouter } from "./routes/get-wallets";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

const transactionConsumer = new KafkaTransactionConsumer();
const userConsumer = new KafkaUserAuthConsumer()

transactionConsumer.start();
userConsumer.start()

app.use(currentUser);

app.use(checkWalletIDforUserRouter)
app.use(checkUserWalletBalanceRouter)
app.use(createWalletRouter); 
app.use(checkWalletBalanceRouter);
app.use(addMoneyWalletRouter);
app.use(transferMoneyWalletRouter);
app.use(withdrawWalletRouter);
app.use(transactionsWalletRouter)
app.use(fetchAllWalletsRouter)

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
