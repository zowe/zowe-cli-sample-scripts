#!/bin/env node
/*
 * This program and the accompanying materials are made available under the terms of the *
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at  *
 * https://www.eclipse.org/legal/epl-v20.html                                            *
 *                                                                                       *
 * SPDX-License-Identifier: EPL-2.0                                                      *
 *                                                                                       *
 * Copyright Contributors to the Zowe Project.                                           *
 */


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const handlebars = require("handlebars");
const fs = require("fs");
const templatesFolder = config.get("templates");
const renderedFolder = config.get("zos_src.local.folder");
fs.readdirSync(templatesFolder).forEach(fileName => {
    console.log("Rendering: " + fileName);
    const templateFile = fs.readFileSync(templatesFolder + fileName).toString();
    const compiledFile = handlebars.compile(templateFile);
    const renderedFile = compiledFile(config);
    if (!fs.existsSync(renderedFolder))
        fs.mkdirSync(renderedFolder);
    fs.writeFileSync(renderedFolder + fileName, renderedFile);
    console.log("Render complete for: " + fileName);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JlbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFVQSxpQ0FBaUM7QUFDakMseUNBQXlDO0FBQ3pDLHlCQUF5QjtBQUV6QixNQUFNLGVBQWUsR0FBVyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFFO0FBQ3pELE1BQU0sY0FBYyxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUVsRSxFQUFFLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsQ0FBQztJQUN0QyxNQUFNLFlBQVksR0FBVyxFQUFFLENBQUMsWUFBWSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUNuRixNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3RELE1BQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7UUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ2pFLEVBQUUsQ0FBQyxhQUFhLENBQUMsY0FBYyxHQUFHLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQ3BELENBQUMsQ0FBQyxDQUFDIn0=