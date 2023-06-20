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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthService = void 0;
class UserAuthService {
    static checkUserAuth(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user is authorized to make payments
            const isUserAuthorized = yield UserAuthService.checkUserAuthorization(userId);
            if (!isUserAuthorized) {
                console.log(`User ${userId} is not authorized to make payments.`);
                return false;
            }
            const isUserAuthenticated = yield UserAuthService.checkUserAuthentication(userId, password);
            if (!isUserAuthorized) {
                console.log(`User ${userId} is not authorized to make payments.`);
                return false;
            }
        });
    }
    static checkUserAuthentication(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Authenticate user based on username and password
            // Return true if user is authenticated, false otherwise
            return true;
        });
    }
    static checkUserAuthorization(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Perform user authorization check, e.g., check if user is active and not banned
            // Return true if user is authorized, false otherwise
            return true;
        });
    }
}
exports.UserAuthService = UserAuthService;
