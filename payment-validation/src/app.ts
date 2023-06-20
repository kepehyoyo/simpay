import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError ,currentUser} from "@cygnetops/common-v2"; 
import { validatePaymentRouter } from "./routes/validate-payment";
import { KafkaTransactionConsumer } from "./events/listeners/transaction-consumers";
import { KafkaWalletConsumer } from "./events/listeners/wallet-consumers";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

const transactionConsumer = new KafkaTransactionConsumer;
const walletConsumer = new KafkaWalletConsumer;


transactionConsumer.start();
walletConsumer.start();

app.use(currentUser); 
app.use(validatePaymentRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
