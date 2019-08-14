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


set +x

tries=20
wait=5
function submitJCL () {
    ds=$1

    echo 'zowe jobs submit data-set "'$ds'" --rff jobid --rft string'
    jobid=`zowe jobs submit data-set $ds --rff jobid --rft string`
    echo $jobid
    echo ''

    echo 'zowe jobs view job-status-by-jobid' $jobid '--rff retcode --rft string'
    retcode=`zowe jobs view job-status-by-jobid $jobid --rff retcode --rft string`
    echo $retcode
    echo ''
    
    counter=0
    while (("$counter" < $tries)) && [ "$retcode" == "null" ]; do
        counter=$((counter + 1))
        sleep $wait
        
        echo 'zowe jobs view job-status-by-jobid' $jobid '--rff retcode --rft string'
        retcode=`zowe jobs view job-status-by-jobid $jobid --rff retcode --rft string`
        echo $retcode
        echo ''
    done
}

submitJCL "USERID.PUBLIC.JCL(DFHEITCL)"