#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

echo ""
echo "Cleaning everything up"
zowe cics dis prog HELLO
zowe cics dis tran RTST
zowe cics del prog HELLO DARKSIDE
zowe cics del tran RTST DARKSIDE
