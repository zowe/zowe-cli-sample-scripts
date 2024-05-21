Write-Output "You have started the creation of a custom Zowe client configuration."

Write-Output "`nInstalling the Endevor plugin for Zowe CLI."
zowe plugins install @broadcom/endevor-for-zowe-cli

Write-Output "Creating your initial Zowe client configuration template."
Write-Output "Press ENTER for the upcoming prompt for host name."
Write-Output "This script will set appropriate host names for you.`n"
zowe config init

Write-Output "`nEnabling self-signed certificates."
zowe config set profiles.base.properties.rejectUnauthorized false

Write-Output "Creating a zosmf connection to your development LPAR."
zowe config set profiles.zosmf_dev "{}"
zowe config set profiles.zosmf_dev.type "zosmf"
zowe config set profiles.zosmf_dev.properties.host "YourDevSystem.YourCompany.com"
zowe config set profiles.zosmf_dev.properties.port 1234

Write-Output "Creating a zosmf connection to your QA LPAR."
zowe config set profiles.zosmf_qa "{}"
zowe config set profiles.zosmf_qa.type "zosmf"
zowe config set profiles.zosmf_qa.host "YourQASystem.YourCompany.com"
zowe config set profiles.zosmf_qa.properties.port 5678

Write-Output "Creating a zosmf connection to your production LPAR."
zowe config set profiles.zosmf_prod "{}"
zowe config set profiles.zosmf_prod.type "zosmf"
zowe config set profiles.zosmf_prod.host "YourProductionSystem.YourCompany.com"
zowe config set profiles.zosmf_prod.properties.port 9012

Write-Output "Setting the default zosmf profile to 'zosmf_dev'."
zowe config set defaults.zosmf "zosmf_dev"

# Sed is not a native command on Windows. We use the Windows native
# findstr command to achieve the same result as our Linux shell script.
Write-Output "Removing the generic zosmf profile created by 'zowe config init'."
zowe config set profiles.zosmf "{}"
Copy-Item zowe.config.json zowe.config.json_to_edit
findstr /v /L /C:'"zosmf": {}' zowe.config.json_to_edit > zowe.config.json
Remove-Item zowe.config.json_to_edit

Write-Output "Setting properties for your Endevor system."
zowe config set profiles.endevor.properties.host "YourEndevorSystem.YourCompany.com"
zowe config set profiles.endevor.properties.port 1234
zowe config set profiles.endevor.secure '["user", "password"]'
zowe config set profiles.endevor-location.properties.system "YourGreatApp"
zowe config set profiles.endevor-location.properties.subsystem "YourNextFix"
zowe config set profiles.endevor-location.properties.stageNumber "1"

Write-Output "Creating a base profile for connecting to APIML."
zowe config set profiles.base_apiml "{}"
zowe config set profiles.base_apiml.type "base"
zowe config set profiles.base_apiml.properties.host "YourApimlSystem.YourCompany.com"
zowe config set profiles.base_apiml.properties.port 12345
zowe config set profiles.base_apiml.properties.rejectUnauthorized false
zowe config set profiles.base_apiml.secure '["user", "password"]'

Write-Output "Creating a zosmf profile for use with APIML."
zowe config set profiles.zosmf_thru_apiml "{}"
zowe config set profiles.zosmf_thru_apiml.type "zosmf"
zowe config set profiles.zosmf_thru_apiml.properties.basePath "ibmzosmf/api/v1"

# Uncomment the following lines to use your APIML connection by default.
<#
Write-Output "Setting the default base profile to 'base_apiml'"
Write-Output "and the default zosmf profile to 'zosmf_thru_apiml'"
zowe config set defaults.base "base_apiml"
zowe config set defaults.zosmf "zosmf_thru_apiml"
#>
