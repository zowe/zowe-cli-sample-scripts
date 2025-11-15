#!/usr/bin/env bash
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
