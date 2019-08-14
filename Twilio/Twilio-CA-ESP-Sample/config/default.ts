/*
 * This program and the accompanying materials are made available under the terms of the *
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at  *
 * https://www.eclipse.org/legal/epl-v20.html                                            *
 *                                                                                       *
 * SPDX-License-Identifier: EPL-2.0                                                      *
 *                                                                                       *
 * Copyright Contributors to the Zowe Project.                                           *
 */

export default {

    "templates": "templates/",
    "library": "",
    "zos_src": {
        "local": {
            "folder": "zos_src/"
        },
        "dsn": {
            "hlq": "",
            "project": "",
            "type": ""
        }
    },
    "jcl": {
        "jobcard": {
            "accounting": "",
            "class": "",
            "msgclass": "",
            "msglevel": ""
        },
        "dsn": {
            "hlq": "",
            "project": "",
            "files": ["FILE1","FILE2","FILE3","FILE4","FILE5","FILE6",
                "FILE7","FILE8","FILE9","FILE10"]
        }
    },
    "esp": {
        "appl": "",
        "jobname": "",
        "definition": "",
        "definition-loader": "",
        "event": {
            "id": "",
            "system": "",
            "member": ""
        }
    },
    "twilio":{
        "accountSid": "",
        "authToken": "",
        "originPhone": "",
        "targetPhone": ""
    }
}