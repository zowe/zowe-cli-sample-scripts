#!/bin/node
/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at  *
* https://www.eclipse.org/legal/epl-v20.html                                            *
*                                                                                       *
* SPDX-License-Identifier: EPL-2.0                                                      *
*                                                                                       *
* Copyright Contributors to the Zowe Project.                                           *
*/

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



