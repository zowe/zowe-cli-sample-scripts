#!/bin/node
/*
 * This program and the accompanying materials are made available and may be used, at your option, under either:
 * - Eclipse Public License v2.0, available at https://www.eclipse.org/legal/epl-v20.html, OR
 * - Apache License, version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

// Script that will send a SMS using the Twilio Service
import * as config from "config";
import * as twilio from "twilio";

const accountSid: string = config.get("twilio.accountSid");
const authToken: string = config.get("twilio.authToken");
const originPhone: string = config.get("twilio.originPhone");
const targetPhone: string = config.get("twilio.targetPhone");
const client = twilio(accountSid, authToken);

export function sendSMS(smsBody: string) {
  client.messages.create({
    body: smsBody,
    from: originPhone,
    to: targetPhone
  }).then(message => console.log('Message sent: ' + message.sid));
}
