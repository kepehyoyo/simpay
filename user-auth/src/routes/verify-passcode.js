"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassCodeRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_v2_1 = require("@cygnetops/common-v2");
const user_1 = require("../models/user");
const router = express_1.default.Router();
exports.verifyPassCodeRouter = router;
// Passport.js local authentication strategy
passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'phoneNumber' }, (phoneNumber, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findOne({ phoneNumber });
        if (!user) {
            return done(null, false, { message: 'Incorrect phone number or password' });
        }
        const isPasswordValid = yield user.checkPassword(password);
        if (!isPasswordValid) {
            return done(null, false, { message: 'Incorrect phone number or password' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
// JWT token generation
function generateToken(user) {
    const payload = { id: user.id, phone: user.phoneNumber };
    const secret = process.env.JWT_KEY || 'secret';
    const options = { expiresIn: '1h' };
    return jsonwebtoken_1.default.sign(payload, secret, options);
}
router.post("/api/user-auth/verify-passcode", [
    (0, express_validator_1.body)("phoneNumber").isString().withMessage("Phone number must be valid"),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty()
        .withMessage("You must supply a password"),
], common_v2_1.validateRequest, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, password } = req.body;
        const user = yield user_1.User.findOne({ phone: phoneNumber });
        if (!user) {
            return res.status(401).json({ message: 'Incorrect phone number or password' });
        }
        if (user) {
            // Authenticate using password if phone number is verified
            passport_1.default.authenticate('local', { session: false }, (error, user) => {
                if (error) {
                    return next(error);
                }
                if (!user) {
                    return res.status(401).json({ message: 'Incorrect phone number or password' });
                }
                const token = generateToken(user);
                return res.status(200).send({ user, token });
                //return res.header('Authorization', 'Bearer ' + token).json({ message: 'Logged in successfully' });
            })(req, res, next);
        }
    }
    catch (error) {
        return next(error);
    }
}));
