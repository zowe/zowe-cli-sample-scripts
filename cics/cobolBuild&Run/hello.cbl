       IDENTIFICATION DIVISION.                                         00010011
       PROGRAM-ID. HELLO.                                               00020012
       ENVIRONMENT DIVISION.                                            00021015
       DATA DIVISION.                                                   00030011
       WORKING-STORAGE SECTION.                                         00050011
       01 WS-LENGTH  PIC S9(4) COMP.                                    00070011
       01 WS-OUTPUT  PIC X(78).                                         00071015
       PROCEDURE DIVISION.                                              00080011
       HelloWorld.                                                      00090018
          MOVE 'Hello World from the script' TO WS-OUTPUT               00100024
          MOVE 70 TO WS-LENGTH                                          00110024
          EXEC CICS SEND TEXT                                           00120011
             FROM (WS-OUTPUT)                                           00130015
             LENGTH(WS-LENGTH)                                          00140017
          END-EXEC.                                                     00150016
          STOP RUN.                                                     00160019
