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


set -e # fail the script if we get a non zero exit code

echo ""
echo "Defining and installing HELLO program"
zowe cics def prog HELLO DARKSIDE
zowe cics ins prog HELLO DARKSIDE

echo ""
echo "Program details"
zowe cics get resource CICSProgram -c "PROGRAM=HELLO" --rft table --rfh --rff program status length

echo ""
echo "Defining and installing RTST transaction"
zowe cics def tran RTST HELLO DARKSIDE
zowe cics ins tran RTST DARKSIDE

echo ""
echo "Transaction details"
zowe cics get resource CICSLocalTransaction -c "TRANID=RTST" --rft table --rfh --rff tranid status
