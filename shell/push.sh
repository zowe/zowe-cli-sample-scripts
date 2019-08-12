#!/bin/sh
#
# This program and the accompanying materials are made available under the terms of the #
# Eclipse Public License v2.0 which accompanies this distribution, and is available at  #
# https://www.eclipse.org/legal/epl-v20.html                                            #
#                                                                                       #
# SPDX-License-Identifier: EPL-2.0                                                      #
#                                                                                       #
# Copyright Contributors to the Zowe Project.                                           #
#


#upload code
bright endevor update element COBLSAMP --env dev --sys ccs --sub demo --typ cobpgm --ff samp.cbl --i WEBSMFNE --sn 1 --ccid share --com "SHARE demo"

#build code
bright endevor generate element COBLSAMP --env dev --sys ccs --sub demo --typ cobpgm --i WEBSMFNE --sn 1 --ccid share --com "SHARE demo"
bright endevor generate element COBLSAMP --env dev --sys ccs --sub demo --typ lnk --i WEBSMFNE --sn 1 --ccid share --com "SHARE demo"
