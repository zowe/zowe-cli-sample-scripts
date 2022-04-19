#! /bin/env node
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
const config = require("config");
const path_1 = require("path");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const hlq = config.get("zos_src.dsn.hlq");
const project = config.get("zos_src.dsn.project");
const type = config.get("zos_src.dsn.type");
const pdsName = `${hlq}.${project}.${type}`;
const inputSource = process.argv[2];
if (inputSource)
    uploadSource(inputSource, pdsName);
function uploadSource(filePath, pdsName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs_1.existsSync(filePath)) {
            const memberName = path_1.basename(filePath, path_1.extname(filePath));
            const zosTarget = `${pdsName}(${memberName})`;
            issueUploadCommand(filePath, zosTarget)
                .then((output) => console.log(output))
                .catch((err) => console.error(err));
        }
        else {
            console.error(`Input source path not found: ${filePath}`);
        }
    });
}
function issueUploadCommand(localFile, dataSet) {
    return new Promise((resolve, reject) => {
        const cmd = `zowe files upload ftds "${localFile}" "${dataSet}"`;
        console.log(`Uploading file ${localFile} to PDS ${dataSet}`);
        child_process_1.exec(cmd, (err, stdout, stderr) => {
            if (err)
                reject(err);
            if (stdout)
                resolve(stdout.toString());
            if (stderr)
                reject(stderr.toString());
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3VwbG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVVBLGlDQUFpQztBQUNqQywrQkFBeUM7QUFDekMsMkJBQWdDO0FBQ2hDLGlEQUFxQztBQUVyQyxNQUFNLEdBQUcsR0FBVyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDbEQsTUFBTSxPQUFPLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzFELE1BQU0sSUFBSSxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNwRCxNQUFNLE9BQU8sR0FBVyxHQUFHLEdBQUcsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFLENBQUM7QUFFcEQsTUFBTSxXQUFXLEdBQVcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QyxJQUFHLFdBQVc7SUFBRSxZQUFZLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRW5ELFNBQWUsWUFBWSxDQUFDLFFBQWdCLEVBQUUsT0FBZTs7UUFDekQsSUFBRyxlQUFVLENBQUMsUUFBUSxDQUFDLEVBQUM7WUFDcEIsTUFBTSxVQUFVLEdBQUcsZUFBUSxDQUFDLFFBQVEsRUFBRSxjQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN6RCxNQUFNLFNBQVMsR0FBRyxHQUFHLE9BQU8sSUFBSSxVQUFVLEdBQUcsQ0FBQztZQUM5QyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO2lCQUNsQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3JDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzNDO2FBQU07WUFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQzdEO0lBQ0wsQ0FBQztDQUFBO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxTQUFpQixFQUFFLE9BQWU7SUFDMUQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNuQyxNQUFNLEdBQUcsR0FBRywyQkFBMkIsU0FBUyxNQUFNLE9BQU8sR0FBRyxDQUFDO1FBQ2pFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLFNBQVMsV0FBVyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzdELG9CQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUM5QixJQUFJLEdBQUc7Z0JBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLElBQUksTUFBTTtnQkFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDdkMsSUFBSSxNQUFNO2dCQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyJ9