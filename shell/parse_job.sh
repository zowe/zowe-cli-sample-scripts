#!/bin/bash

#submit our job
jobid=$(bright zos-jobs submit data-set "solsu01.mimpds.cntl(cblrun)" --rff jobid --rft string)

echo "Submitted our job, JOB ID is $jobid"

#wait for it to go to output
status="UNKNOWN"
while [[ "$status" != "OUTPUT" ]]; do
    echo "Checking status of job $jobid"
    status=$(bright zos-jobs view job-status-by-jobid "$jobid" --rff status --rft string)
    echo "Current status is $status"
    sleep 5s
done;

echo "Job completed in OUTPUT status. Final result of job: "
bright zos-jobs view job-status-by-jobid "$jobid"

# get a list of all of the spool files for our job now that it's in output 
spool_ids=$(bright zos-jobs list spool-files-by-jobid "$jobid" --rff id --rft table)

# save each spool ID to a custom file name 
while read -r id; do
    bright zos-jobs view spool-file-by-id "$jobid" "$id" > ./${jobid}_spool_${id}.txt
    echo "Saved spool DD to ./${jobid}_spool_${id}.txt"
done <<< "$spool_ids"
