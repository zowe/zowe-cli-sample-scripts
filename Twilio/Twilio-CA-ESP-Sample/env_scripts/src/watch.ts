#! /bin/env node
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


// Script used to watch the source folder and upload the changes to z/OS automatically
import {executeCommand} from "./executeCommand";
import * as config from "config";
const nodemon = require("nodemon");

nodemon({
    ext: "jcl rex txt",
    watch: config.get("zos_src.local.folder"),
    exec: "echo Watching for changes"
});

nodemon.on('restart', uploadFile);

async function uploadFile(filePath: string) {
    const cmd: string = `npm run upload ${filePath}`;
    executeCommand(cmd)
        .then((output) => console.log(output))
        .catch((err) => console.error(err));
}
