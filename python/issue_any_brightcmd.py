#
# This program and the accompanying materials are made available and may be used, at your option, under either: #
# * Eclipse Public License v2.0, available at https://www.eclipse.org/legal/epl-v20.html, OR #
# * Apache License, version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0 #
#                                                                                       #
# SPDX-License-Identifier: EPL-2.0 OR Apache-2.0                                        #
#                                                                                       #
# Copyright Contributors to the Zowe Project.                                           #
#                                                                                       #
#

import subprocess
import os
import json
zowe_extension = ""
if os.name == 'nt':
    zowe_extension = ".cmd"
zowe = "zowe" + zowe_extension

# issue a zowe command
zowe_output_str = subprocess.check_output(
    [zowe, 'jobs', 'list', 'jobs', '--response-format-json'])
zowe_output = json.loads(zowe_output_str)  # parse the json response

if not zowe_output["success"]:
    print "List jobs command failed!"
    print str(zowe_output["stderr"])
    exit(1)

jobs = zowe_output["data"]

for job in jobs:
    print "Found job name " + job["jobname"] + " status: " + job["status"]