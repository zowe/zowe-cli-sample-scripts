//ESPEVENT JOB ({{jcl.jobcard.accounting}}),CLASS={{jcl.jobcard.class}},MSGCLASS={{jcl.jobcard.msgclass}},        
// MSGLEVEL={{jcl.jobcard.msglevel}},REGION=0M,NOTIFY=&SYSUID 
//STEP01  EXEC PGM=ESP,PARM='SUBSYS(ESP9)',REGION=4000K
//STEPLIB  DD DSN=CA.ESP.CD7YLOAD,DISP=SHR
//SYSPRINT DD SYSOUT=*
//SYSIN DD *
LOAD '{{zos_src.dsn.hlq}}.{{zos_src.dsn.project}}.{{zos_src.dsn.type}}({{esp.definition}})'