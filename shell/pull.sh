#!/bin/sh
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

#download code
zowe endevor list ele -i WEBSMFNE --env dev --sys ccs --sub demo

zowe endevor retrieve element COBLSAMP --env dev --sys ccs --sub demo --typ cobpgm --tf samp.cbl --i WEBSMFNE --sn 1 --ccid share --com "SHARE demo"