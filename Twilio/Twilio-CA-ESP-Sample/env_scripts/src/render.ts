#!/bin/env node
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


import * as config from "config";
import * as handlebars from "handlebars";
import * as fs from "fs";

const templatesFolder: string = config.get("templates") ;
const renderedFolder: string = config.get("zos_src.local.folder");

fs.readdirSync(templatesFolder).forEach(fileName => {
    console.log("Rendering: " + fileName);
    const templateFile: string = fs.readFileSync(templatesFolder + fileName).toString();
    const compiledFile = handlebars.compile(templateFile);
    const renderedFile = compiledFile(config);
    if (!fs.existsSync(renderedFolder)) fs.mkdirSync(renderedFolder);
    fs.writeFileSync(renderedFolder + fileName, renderedFile);
    console.log("Render complete for: " + fileName);
});