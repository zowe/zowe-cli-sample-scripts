#!/bin/bash
#
# This program and the accompanying materials are made available and may be used, at your option, under either:
# - Eclipse Public License v2.0, available at https://www.eclipse.org/legal/epl-v20.html, OR
# - Apache License, version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
#
# SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
#
# Copyright Contributors to the Zowe Project.
#
#

#submit a simple  job using zowe scripts...
#----------------------------------------------------------------------------------------
#                                   NOTES
# IFS - internal Field seperator. default is SPACE/TAB/newline...
# sample output - JOB08536 CC 0000 Z407281 OUTPUT
#                                                 ----avi.vzm05 -initial test.
#----------------------------------------------------------------------------------------

# output=`zowe zos-jobs submit ds "z40728.jcl(testjob)" --wfo --rft string --rff retcode`;

output=`zowe zos-jobs submit ds "z40728.jcl(testjob)" --wfo --rft table`;
read jobnum dd retcode jobname status <<< $output;

#get the actual return code and if it is more than 4, throw an error
#retcode=$(echo $output |cut -c4-7)
#-eq does integer compare, with retcode as ERROR, it would fail.

if [ $retcode = 0004 ] || [ $retcode = 0000 ]
then
    echo "${jobname}(${jobnum}) completed successfully with return code ${retcode}"
else
    echo "job ${jobname} ${jobnum} failed with return code ${retcode}"
    echo "downloading the output..."
    zowe zos-jobs download output $jobnum
fi