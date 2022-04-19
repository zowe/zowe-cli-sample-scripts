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

from pyzowe import zowe


def list_jobs():
    jobs = zowe('zos-jobs list jobs')
    for job in jobs:
        if job['status'] == 'OUTPUT':
            print(
                f"Job {job['jobname']}({job['jobid']}) has return code {job['retcode']}")


def sysout_of_failed_jobs():
    prefix = "'ZWE*'"
    owner = "ZOWUSER"

    for job in zowe(f"zos-jobs list jobs --prefix {prefix} --owner {owner}"):
        if job['retcode'] not in ['CC 0000', None]:
            print(f"{job['jobname']} {job['jobid']} {job['retcode']}")
            for spool_file in zowe(f"zos-jobs list spool-files-by-jobid {job['jobid']}"):
                if spool_file['ddname'] == 'SYSOUT':
                    sysout = zowe(
                        f"zos-jobs view spool-file-by-id {job['jobid']} {spool_file['id']}")
                    print(sysout)


if __name__ == "__main__":
    list_jobs()
    sysout_of_failed_jobs()
