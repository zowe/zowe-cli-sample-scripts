/*
 * This program and the accompanying materials are made available under the terms of the *
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at  *
 * https://www.eclipse.org/legal/epl-v20.html                                            *
 *                                                                                       *
 * SPDX-License-Identifier: EPL-2.0                                                      *
 *                                                                                       *
 * Copyright Contributors to the Zowe Project.                                           *
 */

const os = require("os");
const fs = require("fs");
const path = require("path");

// process all typescript files
require("glob")("{*,!(node_modules)/}**/{*.js,*.ts,Jenkinsfile,*.py,*.sh}", (globErr, filePaths) => {
    if (globErr) {
        throw globErr;
    }
    // turn the license file into a multi line comment
    const desiredLineLength = 86;
    let alreadyContainedCopyright = 0;
    const jsHeader = "/*\n" + fs.readFileSync("LICENSE_HEADER").toString()
        .split(/\r?\n/g).map((line) => {
            const lenAdjust = desiredLineLength - line.length;
            const pad = Array((lenAdjust < 0) ? 0 : lenAdjust).join(" ");
            return " * " + line + pad + " *";
        })
        .join(os.EOL) + os.EOL + " */" + os.EOL + os.EOL;
    const shHeader = "#\n" + fs.readFileSync("LICENSE_HEADER").toString()
        .split(/\r?\n/g).map((line) => {
            const lenAdjust = desiredLineLength - line.length;
            const pad = Array((lenAdjust < 0) ? 0 : lenAdjust).join(" ");
            return "# " + line + pad + " #";
        })
        .join(os.EOL) + os.EOL + "#" + os.EOL + os.EOL;

    for (const filePath of filePaths) {
        let useShHeader = false;
        if (path.extname(filePath) === ".sh" || path.extname(filePath) === ".py") {
            useShHeader = true;
        }
        const file = fs.readFileSync(filePath);
        let result = file.toString();
        const resultLines = result.split(/\r?\n/g);
        if (resultLines.join().indexOf((useShHeader ? shHeader : jsHeader).split(/\r?\n/g).join()) >= 0) {
            alreadyContainedCopyright++;
            continue; // already has copyright
        }
        const shebangPattern = require("shebang-regex");
        let usedShebang = "";
        result = result.replace(shebangPattern, function (fullMatch) {
            usedShebang = fullMatch + "\n"; // save the shebang that was used, if any
            return "";
        });
        // remove any existing copyright
        // Be very, very careful messing with this regex. Regex is wonderful.
        result = result.replace(/\/\*[\s\S]*?(License|SPDX)[\s\S]*?\*\/[\s\n]*/i, "");
        result = (useShHeader ? shHeader : jsHeader) + result; // add the new header
        result = usedShebang + result; // add the shebang back
        fs.writeFileSync(filePath, result);
    }
    console.log("Ensured that %d files had copyright information" +
        " (%d already did).", filePaths.length, alreadyContainedCopyright);
}
);