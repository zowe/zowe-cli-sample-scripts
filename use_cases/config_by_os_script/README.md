# Configure profiles by using an operating system script

This folder contains sample scripts that demonstrate techniques for creating a site-customized Zowe client configuration using Zowe commands inside a native operating system script.

These scripts are referenced as part of a medium.com article titled [Scripting the creation of a custom Zowe client configuration](https://medium.com/@eugene.johnston/2360c55f2e63)

Two scripts are available. Both perform the same actions. One script is for use on Linux and the other script is for use on Windows. The script named `mkzoweprofiles.sh` is a Linux shell script. The script named `mkZoweProfiles.ps1` is a Windows PowerShell script.

Either script will create the `zowe.config.json` file, which is also located in this folder. In a real world situation, you will first want to modify the script to provide values appropriate for your site.