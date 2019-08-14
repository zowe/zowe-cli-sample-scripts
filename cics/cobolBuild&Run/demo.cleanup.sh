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
echo "Cleaning everything up"
zowe cics dis prog HELLO
zowe cics dis tran RTST
zowe cics del prog HELLO DARKSIDE
zowe cics del tran RTST DARKSIDE
