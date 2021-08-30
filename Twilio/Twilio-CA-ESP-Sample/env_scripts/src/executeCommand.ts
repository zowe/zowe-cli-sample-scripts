/*
 * This program and the accompanying materials are made available under the terms of the *
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at  *
 * https://www.eclipse.org/legal/epl-v20.html                                            *
 *                                                                                       *
 * SPDX-License-Identifier: EPL-2.0                                                      *
 *                                                                                       *
 * Copyright Contributors to the Zowe Project.                                           *
 */

import {exec} from "child_process";

export function executeCommand(command: string) {
    return new Promise((resolve, reject) => {
        exec(command, (err, sdtout, stderr) => {
            if (err) reject(err);
            if (sdtout) resolve(sdtout);
            if (stderr) reject(stderr);
        });
    });
}
