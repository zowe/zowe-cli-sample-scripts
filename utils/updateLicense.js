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

const os = require("os");
const fs = require("fs");
const path = require("path");

(async () => {
    // process all typescript files
    const filePaths = await require("glob").glob("**/{*.js,*.ts,Jenkinsfile,*.py,*.sh}", { ignore: "**/node_modules/**" });

    // turn the license file into a multi line comment
    let alreadyContainedCopyright = 0;
    const jsHeader = "/*\n" + fs.readFileSync("LICENSE_HEADER").toString()
        .split(/\r?\n/g).map((line) => {
            return line ? " * " + line : " *";
        })
        .join(os.EOL) + os.EOL + " */" + os.EOL + os.EOL;
    const shHeader = "#\n" + fs.readFileSync("LICENSE_HEADER").toString()
        .split(/\r?\n/g).map((line) => {
            return line ? "# " + line : "#";
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
        if (useShHeader) {
            // Remove shell/Python style comments containing license info
            // Match all consecutive comment lines that are part of a license block
            result = result.replace(/(^#[^\n]*\n)+(^#[^\n]*(?:License|SPDX|Copyright|Eclipse|Apache)[^\n]*\n)(^#[^\n]*\n)*/gim, "");
        } else {
            result = result.replace(/\/\*[\s\S]*?(License|SPDX)[\s\S]*?\*\/[\s\n]*/i, "");
        }
        // Trim leading whitespace/newlines from the content
        result = result.replace(/^\s+/, "");
        result = (useShHeader ? shHeader : jsHeader) + result; // add the new header
        result = usedShebang + result; // add the shebang back
        fs.writeFileSync(filePath, result);
    }
    console.log("Ensured that %d files had copyright information" +
        " (%d already did).", filePaths.length, alreadyContainedCopyright);
})();