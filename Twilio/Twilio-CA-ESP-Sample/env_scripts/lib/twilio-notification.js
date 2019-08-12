#!/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const twilio = require("twilio");
const accountSid = config.get("twilio.accountSid");
const authToken = config.get("twilio.authToken");
const originPhone = config.get("twilio.originPhone");
const targetPhone = config.get("twilio.targetPhone");
const client = twilio(accountSid, authToken);
function sendSMS(smsBody) {
    client.messages.create({
        body: smsBody,
        from: originPhone,
        to: targetPhone
    })
        .then(message => console.log('Message sent: ' + message.sid));
}
exports.sendSMS = sendSMS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdpbGlvLW5vdGlmaWNhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90d2lsaW8tbm90aWZpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlDQUFpQztBQUNqQyxpQ0FBaUM7QUFFakMsTUFBTSxVQUFVLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzNELE1BQU0sU0FBUyxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN6RCxNQUFNLFdBQVcsR0FBVyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFDNUQsTUFBTSxXQUFXLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0FBQzVELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFFNUMsU0FBZ0IsT0FBTyxDQUFDLE9BQWU7SUFDbkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDdEIsSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsV0FBVztRQUNqQixFQUFFLEVBQUUsV0FBVztLQUNoQixDQUFDO1NBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBUEQsMEJBT0MifQ==