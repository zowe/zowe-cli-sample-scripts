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
 *   It requires that you pass the following arguments:             *
 *                                                                  *
 *   --user         A TSO user id                                   *
 *   --password     The password for the TSO user specified         *
 *                                                                  *
 *   The script also requires a properties file in the project      *
 *   root: "properties.json". The properties file contains the      *
 *   non-sensitive "static" information for the project such as the *
 *   z/OSMF host/port and the source data-sets.                     *
 *                                                                  *
 *   The script parses the input, creates the local directory       *
 *   for the source files and downloads all members from each PDS   *
 *   specified using Zowe CLI.                                      *
 *                                                                  *
 *   If an error is detected, the script will exit immediately with *
 *   an exit code of 1.                                             *
 ********************************************************************/
const spawnSync = require("child_process").spawnSync;
const os = require("os");
const path = require("path");
const fs = require("fs");

/********************************************************************
 *   Process the script input arguments                             *
 ********************************************************************/

// Set of required script arguments
const requiredArgs = ["user", "password"];

// Parse the input arguments into an args object
const args = {};
for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i].startsWith("--")) {
        args[process.argv[i].replace("--", "")] = process.argv[i + 1];
    }
}

// Determine if any required arguments are missing
const missingArgs = requiredArgs.filter((value) => !(value in args));

// If there are missing arguments, report the missing args and exit.
if (missingArgs.length > 0) {
    console.error(`Missing Script Arguments:`);
    console.error(missingArgs);
    console.error("");
    process.exit(1);
}

/********************************************************************
 *   Create the local src directory (target of download)            *
 ********************************************************************/

// Create the src directory
const srcDir = path.join(__dirname, "..", "zossrc");
if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir);
}

/********************************************************************
 *   Download the members using Zowe CLI                            *
 ********************************************************************/

// If on Windows, append ".cmd" to the command
const zoweBin = os.platform() === "win32" ? "zowe.cmd" : "zowe";

// Read the properties file
let properties;
try {
    properties = require("../properties.json");
} catch (err) {
    console.error(`Unable to read "properties.json": ${err.message}`);
    process.exit(1);
}

// Iterate through each source type in the
Object.keys(properties.src).forEach((srcType) => {
    properties.src[srcType].forEach((ds) => {

        // Form the Zowe CLI command.
        const command = [zoweBin, "files", "download", "all-members", `${ds}`];
        const options = ["--user", args.user,
            "--password", args.password,
            "--host", properties.zosmfHost,
            "--port", properties.zosmfPort,
            "--reject-unauthorized", "false",
            "--extension", srcType,
            "--max-concurrent-requests", 10]; // eslint-disable-line @typescript-eslint/no-magic-numbers
        const fullCmd = command.concat(options);

        // Issue the zowe files download all-members command
        console.log(`Issuing zowe command:`);
        console.log(command.join(" ") + "...\n");
        const zoweResponse = spawnSync(fullCmd[0], fullCmd.splice(1), { cwd: srcDir });
        if (zoweResponse.error) {
            console.error(`Unable to spawn zowe command: ${zoweResponse.error.message}`);
            if (zoweResponse.error.message.indexOf("ENOENT") >= 0) {
                console.error('It appears that "zowe" is not installed.');
            }
            console.error("");
            process.exit(1);
        }

        // Print stdout and stderr
        if (zoweResponse.stderr) {
            console.error(zoweResponse.stderr.toString());
        }
        if (zoweResponse.stdout) {
            console.log(zoweResponse.stdout.toString());
        }

        // Print the response
        console.log(`Command exited with "${zoweResponse.status}".`);
        if (zoweResponse.status !== 0) {
            console.error("Review the output above for errors.\n");
            process.exit(1);
        }
        console.log("");
    });
});