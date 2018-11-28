# JENKINS: Submit a job and wait for it to complete

This a sample use case were we setup our Jenkinsfile to submit a job to the mainframe, check the job status and wait until it gets into the *OUTPUT* stage.

Here is a short description of the steps taken by the *[Jenkinsfile](./Jenkinsfile)*.

## Steps

1. Setup the zowe profiles to be used, i.e. execute the *[setup_credentials.sh](./setup_credentials.sh)*
2. Submit the job
3. Verify the job status
4. Output the results (see *[demo_content.sh](./demo_content.sh)*)
