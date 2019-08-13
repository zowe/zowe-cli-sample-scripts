# Twilio CA ESP Sample

This project contain sample scripts to implement new CA ESP jobs and send an SMS notification when its done.

The following are the npm scripts configured:

- watch: It will use the nodemon module to monitor the activity in the zos_src folder and upload any changes to the z/OS
- upload: It will upload files to the z/OS
- render: It will render any file in the templates folder to the zos_src folder
- load-def: Loads the CA ESP job definitions to the CA ESP system
- send-sms: It will send an sms message to the configured systems.
