#!/bin/node
/*
 * This program and the accompanying materials are made available and may be used, at your option, under either: *
 * * Eclipse Public License v2.0, available at https://www.eclipse.org/legal/epl-v20.html, OR *
 * * Apache License, version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0 *
 *                                                                                       *
 * SPDX-License-Identifier: EPL-2.0 OR Apache-2.0                                        *
 *                                                                                       *
 * Copyright Contributors to the Zowe Project.                                           *
 *                                                                                       *
 */


import {executeCommand} from "./executeCommand";
import {sendSMS} from "./twilio-notification";
import * as config from "config";

const hlq: string = config.get("zos_src.dsn.hlq");
const project: string = config.get("zos_src.dsn.project");
const type: string = config.get("zos_src.dsn.type");
const member: string = config.get("esp.definition-loader");
const pdsName: string = `${hlq}.${project}.${type}(${member})`;

submitJobToLoadDefinitions(pdsName)
    .then(getReturnCode)
    .then(validateReturnCode)
    .then((isSuccess) => {
        if (isSuccess) {
            sendSMS("Definitions successfully loaded into CA ESP. Job is ready to use");
        }
    })
    .catch((err) => console.error(err));

async function submitJobToLoadDefinitions(pdsName: string){
    const cmd = `zowe jobs submit ds "${pdsName}" --rff {"jobid"} --rft string`;
    return await executeCommand(cmd);
}

async function getReturnCode(jobID: any){
    console.log(`Traking job: ${jobID}`);
    const cmd = `zowe jobs vw --rff {"retcode"} --rft string jsbj "${jobID}"`;
    return await executeCommand(cmd);
}

function validateReturnCode(returnCode: any) {
    if (returnCode.toString().trim() == 'CC 0000') {
        console.log(`Job completed! ${returnCode}`);
        return true;
    } else {
        console.log(`Job abended! ${returnCode}`);
        return false;
    }
}