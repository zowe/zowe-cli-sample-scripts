#!/bin/sh

#upload code
bright endevor update element COBLSAMP --env dev --sys ccs --sub demo --typ cobpgm --ff samp.cbl --i WEBSMFNE --sn 1 --ccid share --com "SHARE demo"

#build code
bright endevor generate element COBLSAMP --env dev --sys ccs --sub demo --typ cobpgm --i WEBSMFNE --sn 1 --ccid share --com "SHARE demo"
bright endevor generate element COBLSAMP --env dev --sys ccs --sub demo --typ lnk --i WEBSMFNE --sn 1 --ccid share --com "SHARE demo"
