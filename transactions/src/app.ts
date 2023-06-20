import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError,currentUser } from "@cygnetops/common-v2";
import { createTransactionRouter } from "./routes/new";
import { transactionByIdRouter } from "./routes/get-transactionById";
import { listTransactionsRouter } from "./routes/get-transactions";
import { KafkaWalletConsumer } from "./events/listeners/wallet-consumers";
import { KafkaTransactionStatusConsumer } from "./events/listeners/transaction-status-consumers";
import { getStatusRouter } from "./routes/status";
//import { InitiateTransactionRouter } from "./routes/initiate";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
const walletConsumer = new KafkaWalletConsumer();
const transactionStatusConsumer = new KafkaTransactionStatusConsumer();

walletConsumer.start();
transactionStatusConsumer.start();

app.use(currentUser); 
app.use(createTransactionRouter);
app.use(transactionByIdRouter);
app.use(listTransactionsRouter);
app.use(getStatusRouter)
//app.use(InitiateTransactionRouter);


app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
