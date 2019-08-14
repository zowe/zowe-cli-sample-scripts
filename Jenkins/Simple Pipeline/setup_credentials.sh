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



# Unlock the keyring
echo 'jenkins' #| gnome-keyring-daemon --unlock

# Create the Profile (move this to the credential stuff)
bright profiles create zosmf tso1 --host tso1 --port 443 -u $CREDENTIALS_USR -p $CREDENTIALS_PSW --no-ru
bright profiles create endevor endtso1 --host tso1 --port 50002 --user $CREDENTIALS_USR --pass $CREDENTIALS_PSW --prot http
#bright profiles create endevor endca31 --host usilca31 --port 47400 --user $CREDENTIALS_USR --pass $CREDENTIALS_PSW --prot http
bright profiles create fmp fmpca32 --host ca32.ca.com --port 19871 --user $CREDENTIALS_USR --pass $CREDENTIALS_PSW --protocol http --ru false