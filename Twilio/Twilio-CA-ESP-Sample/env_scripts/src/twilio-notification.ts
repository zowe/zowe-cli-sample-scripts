#!/bin/node
// Script that will send a SMS using the Twilio Service
import * as config from "config";
import * as twilio from "twilio";

const accountSid: string = config.get("twilio.accountSid");
const authToken: string = config.get("twilio.authToken");
const originPhone: string = config.get("twilio.originPhone")
const targetPhone: string = config.get("twilio.targetPhone")
const client = twilio(accountSid, authToken)

export function sendSMS(smsBody: string){
    client.messages.create({
     body: smsBody,
     from: originPhone,
     to: targetPhone
   })
  .then(message => console.log('Message sent: ' + message.sid));
}



