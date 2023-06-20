"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UssdRouter = void 0;
const express_1 = __importDefault(require("express"));
const ussd_builder_1 = __importDefault(require("ussd-builder"));
const router = express_1.default.Router();
exports.UssdRouter = router;
/* // Initialize Africa's Talking SMS service
const africasTalking = new AfricasTalking({
  apiKey: "5b3d36bb7debd7cd2c83081db9fe291ea8c9b8dc13796a1d144d62de40963de8",
  username: "sandbox",
});

const sms = africasTalking.SMS;
 */
// Define the USSD menuconst UssdMenu = require('ussd-builder');
let menu = new ussd_builder_1.default();
// Define menu states
menu.startState({
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con('Welcome. Choose option:' +
            '\n1. Show Balance' +
            '\n2. Buy Airtime');
    },
    // next object links to next state based on user input
    next: {
        '1': 'showBalance',
        '2': 'buyAirtime'
    }
});
menu.state('showBalance', {
    run: () => {
        // fetch balance
        //  fetchBalance(menu.args.phoneNumber).then((bal)=>{
        // use menu.end() to send response and terminate session
        menu.end('Your balance is GHC ' + 5);
        //    });
    }
});
menu.state('buyAirtime', {
    run: () => {
        menu.con('Enter amount:');
    },
    next: {
        // using regex to match user input to next state
        '*\\d+': 'buyAirtime.amount'
    }
});
// nesting states
menu.state('buyAirtime.amount', {
    run: () => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        //  buyAirtime(menu.args.phoneNumber, amount).then((res)=>{
        menu.end('Airtime bought successfully.');
        //    });
    }
});
// Registering USSD handler with Express
router.post('/ussd', (req, res) => {
    console.log(req.body.phoneNumber);
    menu.run(req.body, (ussdResult) => {
        res.send(ussdResult);
    });
});
