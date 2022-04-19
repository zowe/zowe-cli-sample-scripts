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

/********************************************************************
 *   This script is intended to be executed from the command line   *
 *   at your terminal or in a Jenkins (or other CI/CD tool)         *
 *   pipeline.                                                      *
 *                                                                  *
 *   The script will remove the zossrc/ directory.                  *
 ********************************************************************/
const path = require("path");
const fs = require("fs");

try {
    const sourceDir = path.join(__dirname, "..", "zossrc");
    console.log("Removing 'zossrc' directory...");
    rmDirR(sourceDir);
    console.log("+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+");
    console.log("| 'zossrc' directory deleted! |");
    console.log("+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+");
    console.log("");
} catch (err) {
    console.error("ERROR!!! Unable to remove source directory 'zossrc'. Please delete manually!");
    console.error(`Error Details: ${err.message}`);
    console.error("");
    process.exit(1);
}

/**
 * Recurisvely delete a directory and its contents.
 * @param {*} path The directory to delete.
 */
function rmDirR(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                rmDirR(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}