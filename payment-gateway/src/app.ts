import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError,currentUser } from "@cygnetops/common-v2";
import { StripePaymentIntentRouter } from "./routes/stripe-payment-intent";
import { momoAddRouter } from "./routes/momo-deposit";
import { momoWithdrawRouter } from "./routes/momo-withdraw";
 
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use(StripePaymentIntentRouter)
app.use(momoAddRouter)
app.use(momoWithdrawRouter)

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
