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


"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const executeCommand_1 = require("./executeCommand");
const twilio_notification_1 = require("./twilio-notification");
const config = require("config");
const hlq = config.get("zos_src.dsn.hlq");
const project = config.get("zos_src.dsn.project");
const type = config.get("zos_src.dsn.type");
const member = config.get("esp.definition-loader");
const pdsName = `${hlq}.${project}.${type}(${member})`;
submitJobToLoadDefinitions(pdsName)
    .then(getReturnCode)
    .then(validateReturnCode)
    .then((isSuccess) => {
    if (isSuccess) {
        twilio_notification_1.sendSMS("Definitions successfully loaded into CA ESP. Job is ready to use");
    }
})
    .catch((err) => console.error(err));
function submitJobToLoadDefinitions(pdsName) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = `zowe jobs submit ds "${pdsName}" --rff {"jobid"} --rft string`;
        return yield executeCommand_1.executeCommand(cmd);
    });
}
function getReturnCode(jobID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Traking job: ${jobID}`);
        const cmd = `zowe jobs vw --rff {"retcode"} --rft string jsbj "${jobID}"`;
        return yield executeCommand_1.executeCommand(cmd);
    });
}
function validateReturnCode(returnCode) {
    if (returnCode.toString().trim() == 'CC 0000') {
        console.log(`Job completed! ${returnCode}`);
        return true;
    }
    else {
        console.log(`Job abended! ${returnCode}`);
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC1ldmVudC1kZWZpbml0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2FkLWV2ZW50LWRlZmluaXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBVUEscURBQStDO0FBQy9DLCtEQUE2QztBQUM3QyxpQ0FBaUM7QUFFakMsTUFBTSxHQUFHLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2xELE1BQU0sT0FBTyxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMxRCxNQUFNLElBQUksR0FBVyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDcEQsTUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzNELE1BQU0sT0FBTyxHQUFXLEdBQUcsR0FBRyxJQUFJLE9BQU8sSUFBSSxJQUFJLElBQUksTUFBTSxHQUFHLENBQUM7QUFFL0QsMEJBQTBCLENBQUMsT0FBTyxDQUFDO0tBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUM7S0FDbkIsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0tBQ3hCLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO0lBQUcsSUFBRyxTQUFTLEVBQUM7UUFDaEMsNkJBQU8sQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO0tBQzdFO0FBQ0gsQ0FBQyxDQUFDO0tBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFFdEMsU0FBZSwwQkFBMEIsQ0FBQyxPQUFlOztRQUNyRCxNQUFNLEdBQUcsR0FBRyx3QkFBd0IsT0FBTyxnQ0FBZ0MsQ0FBQztRQUM1RSxPQUFPLE1BQU0sK0JBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQUE7QUFFRCxTQUFlLGFBQWEsQ0FBQyxLQUFVOztRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sR0FBRyxHQUFHLHFEQUFxRCxLQUFLLEdBQUcsQ0FBQztRQUMxRSxPQUFPLE1BQU0sK0JBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQUE7QUFFRCxTQUFTLGtCQUFrQixDQUFDLFVBQWU7SUFDekMsSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksU0FBUyxFQUFDO1FBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDNUMsT0FBTyxJQUFJLENBQUM7S0FDYjtTQUFNO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUMxQyxPQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0gsQ0FBQyJ9