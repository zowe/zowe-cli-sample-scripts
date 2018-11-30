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