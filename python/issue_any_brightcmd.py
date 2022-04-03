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

#
# This program and the accompanying materials are made available under the terms of the #
# Eclipse Public License v2.0 which accompanies this distribution, and is available at  #
# https://www.eclipse.org/legal/epl-v20.html                                            #
#                                                                                       #
# SPDX-License-Identifier: EPL-2.0                                                      #
#                                                                                       #
# Copyright Contributors to the Zowe Project.                                           #
#

import subprocess
import os
import json
bright_extension = ""
if os.name == 'nt':
    bright_extension = ".cmd"
bright = "bright" + bright_extension

# issue a brightside command
bright_output_str = subprocess.check_output(
    [bright, 'jobs', 'list', 'jobs', '--response-format-json'])
bright_output = json.loads(bright_output_str)  # parse the json response

if not bright_output["success"]:
    print "List jobs command failed!"
    print str(bright_output["stderr"])
    exit(1)

jobs = bright_output["data"]

for job in jobs:
    print "Found job name " + job["jobname"] + " status: " + job["status"]