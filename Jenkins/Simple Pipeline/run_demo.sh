#!/usr/bin/env bash

# Unlock the keyring
echo 'jenkins' #| gnome-keyring-daemon --unlock

# Run the demo
sh $DEMO_SCRIPT