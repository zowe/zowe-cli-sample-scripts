# Update a COBOL program executed via a CICS transaction

This is a sample use case in which we attempt to execute a Hello World COBOL program via a CICS transaction.

Here is a description of the steps taken by the *[demo.sh](./demo.sh)* script.

## Steps

1. Define and install the resources to be used
2. Upload your updated COBOL program (may be able to use the VSCode extension for this)
3. Submit the job to compile and link your COBOL source and wait for it to complete. You may use *[compcbl.jcl](./compcbl.jcl)* as a guide to accomplish this.
  a. Use the *--view-all-spool-content* or *--vasc* flag
  b. **OR** Use the *[compile.sh](./compile.sh)* script
4. Refresh the program, i.e. perform a NEWCOPY on the CICS resource
5. Voila! You can now execute your newly defined transaction.

### Caveats

- The JCL may contain generic terms like ***USERID*** or ***CICS.GENERAL.LIBRARY*** that need changed to the corresponding items
- We used **zowe console** commands to execute the CICS transaction.
- You will need to clean up the environment after you are done! :)