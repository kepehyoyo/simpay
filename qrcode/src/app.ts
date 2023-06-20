import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError ,currentUser} from "@cygnetops/common-v2";
import { createQRCodeRouter } from "./routes/new";
import { getQRCodeRouter } from "./routes/getcode";

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
app.use(createQRCodeRouter); 
app.use(getQRCodeRouter); 

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
