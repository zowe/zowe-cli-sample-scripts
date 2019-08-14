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

# Setup
./demo.setup.sh

# Run
./demo.run.sh

# Clean
./demo.cleanup.sh

echo ""
echo "We did it! :)"
