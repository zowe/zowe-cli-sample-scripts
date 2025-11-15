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
echo "Cleaning everything up"
zowe cics dis prog HELLO
zowe cics dis tran RTST
zowe cics del prog HELLO DARKSIDE
zowe cics del tran RTST DARKSIDE
