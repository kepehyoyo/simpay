import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@cygnetops/common-v2";
import { UssdRouter } from "./routes/ussd";

 

const app = express();
app.set("trust proxy", true);
app.use(json());

app.use(express.urlencoded({extended:true}))
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(UssdRouter);
 

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
