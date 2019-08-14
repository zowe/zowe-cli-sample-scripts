#!/usr/bin/env bash
#
# This program and the accompanying materials are made available under the terms of the #
# Eclipse Public License v2.0 which accompanies this distribution, and is available at  #
# https://www.eclipse.org/legal/epl-v20.html                                            #
#                                                                                       #
# SPDX-License-Identifier: EPL-2.0                                                      #
#                                                                                       #
# Copyright Contributors to the Zowe Project.                                           #
#


#test

#submit our job
jobid=$(zowe zos-jobs submit data-set "solsu01.mimpds.cntl(cblrun)" --rff jobid --rft string)

echo "Submitted our job, JOB ID is $jobid"

#wait for it to go to output
status="UNKNOWN"
while [ "$status" != "OUTPUT" ]; do
    echo "Checking status of job $jobid"
    status=$(zowe zos-jobs view job-status-by-jobid "$jobid" --rff status --rft string)
    echo "Current status is $status"
    sleep 5s
done;

echo "Job completed in OUTPUT status. Final result of job: "
zowe zos-jobs view job-status-by-jobid "$jobid"
zowe zos-jobs list spool-files-by-jobid "$jobid"

zowe zos-jobs view sfbi "$jobid" 2
zowe zos-jobs view sfbi "$jobid" 103
