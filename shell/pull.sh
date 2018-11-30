#!/bin/sh

#download code
bright endevor list ele -i WEBSMFNE --env dev --sys ccs --sub demo

bright endevor retrieve element COBLSAMP --env dev --sys ccs --sub demo --typ cobpgm --tf samp.cbl --i WEBSMFNE --sn 1 --ccid share --com "SHARE demo"