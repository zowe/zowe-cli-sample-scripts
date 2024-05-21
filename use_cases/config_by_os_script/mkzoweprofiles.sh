#! /bin/sh
# This script can be customized to automatically create a Zowe
# client configuration and populate the profiles in that
# configuration with your site-specific configuration values.
echo "You have started the creation of a custom Zowe client configuration."

# You want to install your desired plugins before later running
# the 'zowe config init' command, because the 'zowe config init'
# command will create template profiles for any installed Zowe plugins.
# For this example, we install the Endevor plugin.
echo "\nInstalling the Endevor plugin for Zowe CLI."
zowe plugins install @broadcom/endevor-for-zowe-cli

# We run the 'zowe config init' command to create a template configuration.
# The 'zowe config init' command prompts the user for host, user, and password.
# It stores those values in the generated template, within your base profile.
#
# A base profile can be used to connect to APIML, or the values of key
# connection properties in a base profile will be used as the default values
# for service profiles which do not contain some of those required properties.
# We use this base profile only for some default values. A base profile for
# APIML comes later in this script. In this example, all of your services are
# on different LPARs, so we do not need a default host name in the base profile.
echo "Creating your initial Zowe client configuration template."
echo "Press ENTER for the upcoming prompt for host name."
echo "This script will set appropriate host names for you.\n"
zowe config init

# The 'zowe config init' command already stored user and password in the
# generated base profile. So, we only add a value for the
# 'rejectUnauthorized' property, which will then be inherited by all other
# service profiles. Setting rejectUnauthorized to false allows any REST
# request to accept a self-signed certificate. You should set this value
# to adhere to your site's security policy.
echo "\nEnabling self-signed certificates."
zowe config set profiles.base.properties.rejectUnauthorized false

# This site uses zosmf on three different LPARs. One for development,
# one for QA, and one for production. Since all 3 LPARs are in the
# same SYSPLEX, they can share the user and password from the
# base profile, which were set by the earlier 'zowe config init' command.
# For each new LPAR, we set the type to "zosmf", set the host name, and
# set the correct port number.

# Create a direct-connection profile for the development LPAR.
echo "Creating a zosmf connection to your development LPAR."
zowe config set profiles.zosmf_dev "{}"
zowe config set profiles.zosmf_dev.type "zosmf"
zowe config set profiles.zosmf_dev.properties.host "YourDevSystem.YourCompany.com"
zowe config set profiles.zosmf_dev.properties.port 1234

# Create a direct-connection profile for the QA LPAR.
echo "Creating a zosmf connection to your QA LPAR."
zowe config set profiles.zosmf_qa "{}"
zowe config set profiles.zosmf_qa.type "zosmf"
zowe config set profiles.zosmf_qa.host "YourQASystem.YourCompany.com"
zowe config set profiles.zosmf_qa.properties.port 5678

# Create a direct-connection profile for the production LPAR.
echo "Creating a zosmf connection to your production LPAR."
zowe config set profiles.zosmf_prod "{}"
zowe config set profiles.zosmf_prod.type "zosmf"
zowe config set profiles.zosmf_prod.host "YourProductionSystem.YourCompany.com"
zowe config set profiles.zosmf_prod.properties.port 9012

# We connect to the development LPAR most often,
# so make it the default zosmf profile
echo "Setting the default zosmf profile to 'zosmf_dev'."
zowe config set defaults.zosmf "zosmf_dev"

# Since we previously created your own zosmf profiles, we no
# longer need the zosmf profile created by 'zowe config init'.
# We now remove that original zosmf profile. To help with that,
# we use the native Linux command named sed (stream editor).
echo "Removing the generic zosmf profile created by 'zowe config init'."
zowe config set profiles.zosmf "{}"
mv zowe.config.json zowe.config.json_to_edit
sed -e '0,/"zosmf":/{/zosmf/d}' zowe.config.json_to_edit > zowe.config.json
rm zowe.config.json_to_edit

# The 'zowe config init' command conveniently creates profiles for
# every CLI plugin that you have installed at the time that you run
# the 'zowe config init' command. Such profiles are not created with
# values specific for your site. We can set those values in this
# script. In our example, the Endevor plugin was installed before we
# ran 'zowe config init'. Below, we make a direct-to-service connection
# to Endevor. Pretend that your Endevor service runs on a separate host
# from your other services, and it requires a user and password that
# are different from those in your SYSPLEX. We do not set the values
# for user and password within this script because we do not want this
# script to contain hard-coded credentials. We will let your first
# Endevor CLI command prompt for those values, and the command will
# automatically store those values in the Secure Credential Store.
echo "Setting properties for your Endevor system."
zowe config set profiles.endevor.properties.host "YourEndevorSystem.YourCompany.com"
zowe config set profiles.endevor.properties.port 1234
zowe config set profiles.endevor.secure '["user", "password"]'

# Also set some properties in the endevor-location profile.
zowe config set profiles.endevor-location.properties.system "YourGreatApp"
zowe config set profiles.endevor-location.properties.subsystem "YourNextFix"
zowe config set profiles.endevor-location.properties.stageNumber "1"

# This site is also experimenting with APIML. We want to connect
# to one zosmf instance through APIML to test your deployment.
# First, we create a new base profile to specifically connect to
# APIML. Again, We do not set user and password values within this script.
# We will let your first CLI command prompt for and store those values.
echo "Creating a base profile for connecting to APIML."
zowe config set profiles.base_apiml "{}"
zowe config set profiles.base_apiml.type "base"
zowe config set profiles.base_apiml.properties.host "YourApimlSystem.YourCompany.com"
zowe config set profiles.base_apiml.properties.port 12345
zowe config set profiles.base_apiml.properties.rejectUnauthorized false
zowe config set profiles.base_apiml.secure '["user", "password"]'

# You need a different zosmf profile with some different properties
# for use with APIML. You do not need host, port, user, and password.
# Those properties are all handled by the 'base_apiml' profile above.
# We do need a new property named 'basePath' which enables APIML to
# route REST requests to the correct endpoint.
echo "Creating a zosmf profile for use with APIML."
zowe config set profiles.zosmf_thru_apiml "{}"
zowe config set profiles.zosmf_thru_apiml.type "zosmf"
zowe config set profiles.zosmf_thru_apiml.properties.basePath "ibmzosmf/api/v1"

# If we wanted to connect through APIML by default, we could set the
# default base profile to your new base_apiml profile. In this example,
# we leave the following assignments commented out because we intend
# to leave the default as the direct-to-service connnection profile named
# zosmf_dev. We set zosmf_dev as the default earlier in this script.
# For a given command, you can instead add the CLI command options
# "--base-profile base_apiml" and "--zosmf-profile zosmf_thru_apiml"
# for any command that your want to route through APIML.
#
# echo "Setting the default base profile to 'base_apiml'"
# echo "and the default zosmf profile to 'zosmf_thru_apiml'"
# zowe config set defaults.base "base_apiml"
# zowe config set defaults.zosmf "zosmf_thru_apiml"

echo "\nYour custom creation of a Zowe client configuration is complete."
