import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@cygnetops/common-v2";

//api endpoints
import { activateCouponRouter } from "./routes/activate-coupon";
import { applyCouponRouter } from "./routes/apply-coupon";
import { createCouponRouter } from "./routes/create-coupons";
import { deleteCouponRouter } from "./routes/delete-coupon";
import { generateCouponCodeRouter } from "./routes/generate-coupon-code";
import { getCouponsRouter } from "./routes/get-coupons";
import { listCouponsRouter } from "./routes/list-coupons";
import { redeemCouponRouter } from "./routes/redeem-coupon";
import { updateCouponRouter } from "./routes/update-coupon";
import { validateCouponRouter } from "./routes/validate-coupon";


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
app.use(activateCouponRouter);
app.use(applyCouponRouter)
app.use(createCouponRouter)
app.use(deleteCouponRouter)
app.use(generateCouponCodeRouter)
app.use(getCouponsRouter)
app.use(listCouponsRouter)
app.use(redeemCouponRouter)
app.use(updateCouponRouter)
app.use(validateCouponRouter)


app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
