#!/bin/bash
#
# This program and the accompanying materials are made available under the terms of the #
# Eclipse Public License v2.0 which accompanies this distribution, and is available at  #
# https://www.eclipse.org/legal/epl-v20.html                                            #
#                                                                                       #
# SPDX-License-Identifier: EPL-2.0                                                      #
#                                                                                       #
# Copyright Contributors to the Zowe Project.                                           #
#


# Add a user to z/OS
echo This script will walk you through adding a user to z/OS. 
echo 'What is the UserID you would like to add to z/OS? This must be less than 8 characters long.'
    read username
echo The username you are creating is: $username
echo 'What is the reason you are adding this UserID to zLight?'
    read description
echo 'What system are you trying to add this UserID to? (1-9)'
echo '1. System1'
echo '2. System2'
    read system
echo The system you are adding $username to is ZLP$system

# Set the Zowe z/OSMF Profile to the correct target system for the new UserID
if [ "$system" -eq 1 ]; then
    zowe profiles set zosmf ZLP1
    zowe profiles set ssh ZLP1
    zowe profiles set tso ZLP1
    echo Your Zowe profiles have been set to ZLP1. 
elif [ "$system" -eq 2 ]; then
    zowe profiles set zosmf ZLP2
    zowe profiles set ssh ZLP2
    zowe profiles set tso ZLP2
    echo Your Zowe profiles have been set to ZLP2. 
fi

#Job 1: Edit the ACS.SOURCE(STORCLAS) member to add SMS logic for UserIDs
zowe zos-files upload stdin-to-data-set "DANJAST.JCL(ZWEUSER1)" <<EOF
//ZWEUSER1 JOB 'D6077P,B9200047','DANJAST',MSGCLASS=H,MSGLEVEL=(1,1),          
//         NOTIFY=&SYSUID,CLASS=P,REGION=0M                               
//INSERT1  EXEC PGM=IKJEFT01,DYNAMNBR=100,REGION=0M                       
//SYSEXEC  DD DISP=SHR,DSN=SYSL.REXX                                      
//INPUT    DD DISP=SHR,DSN=SYSL.ZLP${zlight}.ACS.SOURCE(STORCLAS)                       
//SYSPRINT DD SYSOUT=*                                                    
//SYSTSPRT DD SYSOUT=*                                                    
//SYSTSIN  DD *                                                           
  EX 'SYSL.REXX(INACSSRC)' '${username},${description}'                            
/*                                                                                                                                         
EOF

# Submit the job that has been updated with your UserID and System
jobid1=`zowe jobs submit data-set "DANJAST.JCL(ZWEUSER1)" --rff jobid --rft string`
retcode1=`zowe jobs view job-status-by-jobid $jobid1 --rff retcode --rft string`

    if [ "$retcode1" == "null" ]; then
        echo 'Your job timed out'
        exit 1
    elif [ "$retcode1" != "CC 0000" ]; then
        echo 'Your job did not complete with CC 0000'
    else
        echo 'Your job completed successfully with a CC 0000'
    fi


#Job 2: Create RACF Permissions / Work for new userid
zowe zos-files upload stdin-to-data-set "DANJAST.JCL(ZWEUSER2)" <<EOF
//ZWEUSER2 JOB  MSGLEVEL=1,CLASS=A,MSGCLASS=R,NOTIFY=&SYSUID,          
//    REGION=0M                                                        
//TSO      EXEC PGM=IKJEFT01,DYNAMNBR=50                               
//SYSLBC   DD   DSN=SYS1.BRODCAST,DISP=SHR                             
//SYSTSPRT DD   SYSOUT=*                                               
//SYSTSIN  DD   *                                                      
AU  ($username) NOGRPACC DFLTGRP(ZLP$system) TSO(PROC(ZLIGHT) ACCTNUM(PEL))           
ALU ($username) NAME('User Created with Zowe Script')                                 
ALU ($username) TSO(SIZE(00128000))                                      
ALU ($username) OPERPARM(AUTH(USE) MFORM(S M) ROUTCODE(2))               
ALU ($username) OPERPARM(UD(YES) STORAGE(1)) UACC(NONE)                  
ALU ($username) PASSWORD(WELCOME) NOEXPIRED                              
PASSWORD USER($username) INTERVAL(186)                                   
ADDSD ('$username.**') UACC(NONE)                                        
PERMIT '$username.**'     ACCESS(READ)  ID(ZLP$system)                                     
PERMIT '$username.**'     ACCESS(ALTER)   ID(SYSPROG)                     
CONNECT ($username)       GROUP(IZUUSER)               
/*                                                                     
EOF

# Submit the job that has been updated with your UserID and System
jobid2=`zowe jobs submit data-set "DANJAST.JCL(ZWEUSER2)" --rff jobid --rft string`
retcode2=`zowe jobs view job-status-by-jobid $jobid2 --rff retcode --rft string`

    if [ "$retcode2" == "null" ]; then
        echo 'Your job timed out'
        exit 1
    elif [ "$retcode2" != "CC 0000" ]; then
        echo 'Your job did not complete with CC 0000'
    else
        echo 'Your job completed successfully with a CC 0000'
    fi

# TSO LU USERID which was just created to verify job worked successfully
echo To verify the work we just did, entering the command TSO LU $username
zowe tso issue command "LU $username"

#Job 3: create the ALIAS for the userid on the system.  This is a CATALOG entry to allow dataset creation for the hlq of the userid
zowe zos-files upload stdin-to-data-set "DANJAST.JCL(ZWEUSER3)" <<EOF
//ZWEUSER3  JOB ,,MSGLEVEL=1,MSGCLASS=H,CLASS=A,REGION=2048K,  
//    USER=CATUPDT                                            
//IDCAMS   EXEC PGM=IDCAMS                                    
//PACKL1   DD   UNIT=3390,DISP=SHR,VOL=SER=L${zlight}MCAT             
//SYSPRINT DD   SYSOUT=*                                      
//SYSIN    DD   *                                             
  DEFINE ALIAS (NAME($username) RELATE(CATALOG.ZLP${zlight}USER.CAT)) - 
                                CAT(CATALOG.ZLP${zlight}MSTR.CAT)     
/*                                                                                                                            
EOF

# Submit the job that has been updated with your UserID and System
jobid3=`zowe jobs submit data-set "DANJAST.JCL(ZWEUSER3)" --rff jobid --rft string`
retcode3=`zowe jobs view job-status-by-jobid $jobid3 --rff retcode --rft string`

    if [ "$retcode3" == "null" ]; then
        echo 'Your job timed out'
        exit 1
    elif [ "$retcode3" != "CC 0000" ]; then
        echo 'Your job did not complete with CC 0000'
    else
        echo 'Your job completed successfully with a CC 0000'
    fi

# List the ALIAS Dataset to confirm it was allocated appropriately
echo These are the attributes of the ALIAS Dataset you just allocated:
zowe files list ds "$username" -a

# Job 4: The ISPPROF dataset is needed by ISPF for each userid when using ISPF.  When they logon, the logon proc will need this dataset to be active before they can successfully access ISPF. 
zowe zos-files upload stdin-to-data-set "DANJAST.JCL(ZWEUSER4)" <<EOF
//ADDUSER3  JOB ,'ADD USER $username',                         
//    MSGLEVEL=(1,1),MSGCLASS=H,CLASS=A,NOTIFY=&SYSUID      
/*JOBPARM SYSAFF=*                                          
//PROFILE  EXEC PGM=IEFBR14                                 
//DD1      DD   DSN=$username.SPF.ISPPROF,                    
//             SPACE=(TRK,(2,1,10)),DISP=(NEW,CATLG),       
//             DCB=(DSORG=PO,RECFM=FB,LRECL=80,BLKSIZE=3120)
/*                                                                                                                                                                      
EOF

# Submit the job that has been updated with your UserID and System
jobid4=`zowe jobs submit data-set "DANJAST.JCL(ZWEUSER4)" --rff jobid --rft string`
retcode4=`zowe jobs view job-status-by-jobid $jobid4 --rff retcode --rft string`

    if [ "$retcode4" == "null" ]; then
        echo 'Your job timed out'
        exit 1
    elif [ "$retcode4" != "CC 0000" ]; then
        echo 'Your job did not complete with CC 0000'
    else
        echo 'Your job completed successfully with a CC 0000'
    fi

# List the ISPPROF Dataset to confirm it was allocated appropriately
echo These are the attributes of the ISPPROF Dataset you just allocated:
zowe files list ds "$username.SPF.ISPPROF" -a

echo Your UserID $username has been officially added to ZLP$system. The password the user can use to login to z/OS is WELCOME. 
echo Would you like this UserID to log into Unix System Services as well? Resond YES or NO
    read outputResponse
if [ "$outputResponse" == "YES" ]; then

# Job 5: To access OMVS (USS), the userid on PEL systems will attempt an auto-mount of a ZFS file in naming convention:  OMVS.ZFS.USER.<userid>.  So, when the user enters TSO ISH or TSO OMVS, auto-mount will attempt a mount with the following specifications:   mount point /u/<userid>  mounted to file OMVS.ZFS.USER.<userid>
# The ZFS file is needed.  Create the ZFS file with the following batch job.  Be careful to ensure that words “aggregate” and “compat” are lower-case.

zowe zos-files upload stdin-to-data-set "DANJAST.JCL(ZWEUSER5)" <<EOF
//ZWEUSER5  JOB ,'ADD USER $username',                        
//    MSGLEVEL=(1,1),MSGCLASS=H,CLASS=A,NOTIFY=&SYSUID     
/*JOBPARM SYSAFF=*                                         
//DEFZFS   EXEC PGM=IDCAMS                                 
//SYSPRINT DD   SYSOUT=H                                   
//SYSIN    DD   *                                          
  DEFINE CLUSTER (NAME(OMVS.ZFS.USER.$username) -            
         LINEAR CYL(5 5) SHAREOPTIONS(3))                
/*                                                         
//FORZFS01 EXEC PGM=IOEAGFMT,                              
//        PARM=('-aggregate OMVS.ZFS.USER.$username -compat')
//SYSPRINT DD   SYSOUT=H                                   
/*                                                                                                                                                                                                         
EOF

# Submit the job that has been updated with your UserID and System
jobid5=`zowe jobs submit data-set "DANJAST.JCL(ZWEUSER5)" --rff jobid --rft string`
retcode5=`zowe jobs view job-status-by-jobid $jobid5 --rff retcode --rft string`
    if [ "$retcode5" == "null" ]; then
        echo 'Your job timed out'
        exit 1
    elif [ "$retcode5" != "CC 0000" ]; then
        echo 'Your job did not complete with CC 0000'
    else
        echo 'Your job completed successfully with a CC 0000'
    fi

# Job 6: Add OMVS segment for userid. Remember the UID we got from TSO ISH?.....  It was 209.  This is where that comes in to play.  We need to add an OMVS segment to the userid.  OMVS segment requires the UID.  Be careful to check the GID (group ID) with TSO ISH.  Be careful that the syntax is case-sensitive!
zowe zos-files upload stdin-to-data-set "DANJAST.JCL(ZWEUSER6)" <<EOF
//ADDUSER  JOB ,'ADD USER L8LAB01',                                 
//    MSGLEVEL=(1,1),MSGCLASS=H,CLASS=A,NOTIFY=&SYSUID              
/*JOBPARM SYSAFF=*                                                  
//STEP1     EXEC PGM=IKJEFT01,DYNAMNBR=50                           
//SYSLBC    DD   DSN=SYS1.BRODCAST,DISP=SHR                         
//SYSTSPRT  DD   SYSOUT=*                                           
//SYSTSIN   DD   *                                                                                       
ALU ($username) OMVS(AUTOUID  HOME('/u/$username') PROGRAM('/bin/sh')) 
/*                                                                                                                                                                                                                                                                           
EOF

# Submit the job that has been updated with your UserID and System
jobid6=`zowe jobs submit data-set "DANJAST.JCL(ZWEUSER6)" --rff jobid --rft string`
retcode6=`zowe jobs view job-status-by-jobid $jobid6 --rff retcode --rft string`
    if [ "$retcode6" == "null" ]; then
        echo 'Your job timed out'
        exit 1
    elif [ "$retcode6" != "CC 0000" ]; then
        echo 'Your job did not complete with CC 0000'
    else
        echo 'Your job completed successfully with a CC 0000'
    fi
# TSO LU USERID OMVS which was just created to verify job worked successfully
echo To verify the work we just did, entering the command TSO LU $username
zowe tso issue command "LU $username OMVS"

else
    echo Your UserID $username has been officially added to ZLP$system. The password the user can use to login to z/OS is WELCOME. Have a great day and remember, z/OS is easy :)
fi