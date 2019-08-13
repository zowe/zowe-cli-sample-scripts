//IEFBR14T JOB ({{jcl.jobcard.accounting}}),CLASS={{jcl.jobcard.class}},MSGCLASS={{jcl.jobcard.msgclass}},        
//             MSGLEVEL={{jcl.jobcard.msglevel}},REGION=0M,NOTIFY=&SYSUID 
//STEP1    EXEC PGM=IEFBR14
{{#jcl.dsn.files}}
//DEL{{@index}}    DD DSN={{../this.jcl.dsn.hlq}}.{{../this.jcl.dsn.project}}.{{@this}},DISP=(MOD,DELETE),      
//         SPACE=(CYL,(5,2)),UNIT=SYSALLDA,                   
//         DCB=(LRECL=255,BLKSIZE=0,RECFM=FB)                 
{{/jcl.dsn.files}}
//STEP2    EXEC PGM=IEFBR14
{{#jcl.dsn.files}}
//CRE{{@index}}    DD DSN={{../this.jcl.dsn.hlq}}.{{../this.jcl.dsn.project}}.{{@this}},DISP=(NEW,CATLG),      
//         SPACE=(CYL,(5,2)),       
//         DCB=(LRECL=255,BLKSIZE=0,RECFM=FB)
{{/jcl.dsn.files}}            