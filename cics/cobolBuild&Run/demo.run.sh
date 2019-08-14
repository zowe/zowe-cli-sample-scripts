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
echo "Uploading the cobol program"
zowe files ul ftds hello.cbl "USERID.PUBLIC.COBOL(HELLO)"

echo ""
echo "Compiling the cobol program"
zowe jobs sub lf compcbl.jcl --vasc
# ./compile.sh

echo ""
echo "Refreshing the CICS program"
zowe cics ref prog HELLO

echo ""
echo "Program details"
zowe cics get resource CICSProgram -c "PROGRAM=HELLO" --rft table --rfh --rff program status length

echo ""
echo "Executing the transaction"
zowe console issue cmd "F CICSRGN,RTST"
