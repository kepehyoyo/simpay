import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError,currentUser } from "@cygnetops/common-v2";
import { verifyPhoneNumberRouter } from "./routes/verify-phone-number";
import { resendCodeRouter } from "./routes/resend-code";
import { verifyCodeRouter } from "./routes/verify-code";
import { signupRouter } from "./routes/signup";
import { checkUserExistsRouter } from "./routes/check-user-exists";
import { verifyPassCodeRouter } from "./routes/verify-passcode";
import passport from "passport";




const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(passport.initialize());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use(verifyPassCodeRouter)
app.use(checkUserExistsRouter)
app.use(verifyPhoneNumberRouter);
app.use(resendCodeRouter);
app.use(verifyCodeRouter);
app.use(signupRouter)

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
