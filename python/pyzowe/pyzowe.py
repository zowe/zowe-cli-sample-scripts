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

""" pyzowe - Zowe CLI Convenience Wrapper Function

This module contains a single function `zowe(argument)` that provides a simple way
how to call Zowe CLI command and parse its output.

Example::

    from pyzowe import zowe

    for job in zowe("zos-jobs list jobs"):
        print(f"Job {job['jobid']} has return code {job['retcode']}")

"""
import subprocess
import json
import os


class ZoweCallError(Exception):
    """Error that is raise when the CLI command fails. Provides same data as :pyclass:`subprocess.CalledProcessError`
       plus the parsed response from Zowe CLI."""

    def __init__(self, returncode, cmd, arguments, output=None, stderr=None):
        self.cmd = cmd
        self.arguments = arguments
        self.returncode = returncode
        self.output = self.stdout = output
        self.stderr = stderr
        self.error = None
        self.message = None
        self._parse_zowe_error(output)

    def _parse_zowe_error(self, output):
        try:
            parsed = json.loads(output)
            if "exitCode" in parsed:
                self.returncode = parsed["exitCode"]
            if "stdout" in parsed:
                self.output = self.stdout = parsed["stdout"]
            if "stderr" in parsed:
                self.stderr = parsed["stderr"]
            self.message = parsed.get("message")
            self.error = parsed.get("error")
        except json.JSONDecodeError:
            pass

    def __str__(self):
        if self.returncode and self.returncode < 0:
            return "Zowe CLI command '%s' died with return code %d." % (self.cmd, -self.returncode)
        else:
            if self.stderr:
                return "Zowe CLI command with arguments '%s' returned non-zero exit status %d and error:\n%s" % (
                    self.arguments, self.returncode, self.stderr)
            else:
                return "Zowe CLI command with arguments '%s' returned non-zero exit status %d." % (
                    self.arguments, self.returncode)

    def __repr__(self):
        return "ZoweCallError(%s, %s, %s, %s, %s)" % (repr(self.returncode), repr(self.cmd), repr(self.arguments), repr(self.stdout), repr(self.stderr))


def zowe(arguments: str):
    """Call Zowe CLI command with provided arguments as a single string.

    :returns: Data part of the JSON response from Zowe CLI. It can be a list or a dictionary.
              It raises :py:class:`ZoweCallError` in case of a failed Zowe CLI command.

    Example::

        from pyzowe import zowe

        for job in zowe("zos-jobs list jobs"):
            print(f"Job {job['jobid']} has return code {job['retcode']}")
    """
    old_color = os.environ['FORCE_COLOR']
    os.environ['FORCE_COLOR'] = "0"
    zowe_command = "zowe " + arguments + " --rfj"
    os.environ['FORCE_COLOR'] = old_color
    try:
        completed_process = subprocess.run(
            zowe_command, shell=True, capture_output=True, check=True, encoding="utf8")
        parsed_output = json.loads(completed_process.stdout)
        return parsed_output.get("data", parsed_output)
    except subprocess.CalledProcessError as e:
        raise ZoweCallError(e.returncode, e.cmd, arguments,
                            output=e.output, stderr=e.stderr)
