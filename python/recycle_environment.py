###################################################################################
#
# Automated Task to recycle/start MTCA QA environment
#
###################################################################################

import os, time

# Check if ZMSHUB is running
# This STC is the offical hub for CA31, don't want to be bringing it down without warning everyone.
display_active_ZMSHUB = os.popen('bright zos-console issue command "RO CA31,D A,ZMSHUB" --zosmf-p tso1').read()
if "ZMSHUB NOT FOUND" in display_active_ZMSHUB:
    print("ZMSHUB on CA31 not started. This task must be running before the environment can be started.")
    exit(1)

# Issue stops to OPSKWS31, MZ103OP, and MSZ101OP if they are running
tasks = [('OPSKWS31', 'CA31'), ('MSZ103OP', 'CA31'), ('MSZ101OP', 'CA11')]  # (STC_NAME, SYS_NAME)
for task in tasks:
    stc_name = task[0]
    sys_name = task[1]
    display_active = os.popen('bright zos-console issue command ' +
                              '"RO ' + sys_name + ',D A,' + stc_name + '" --zosmf-p tso1').read()
    if (stc_name + " NOT FOUND") not in display_active:
        print("Issuing 'STOP' for " + stc_name)
        stop = os.popen('bright zos-console issue command ' +
                        '"RO ' + sys_name + ',stop ' + stc_name + '" --zosmf-p tso1').read()
    else:
        continue

for task in tasks:
    stc_name = task[0]
    sys_name = task[1]
    retry = 60  # Wait Time in Seconds
    # Wait for task to stop, if it doesn't stop after $retry seconds, cancel it
    print("Waiting for " + stc_name + " to stop. If it is not stopped after " + str(retry) +
          " seconds, 'CANCEL' will be issued.")
    cnt = 0
    while cnt < retry and ((stc_name + " NOT FOUND") not in os.popen('bright zos-console issue command ' +
                                                '"RO ' + sys_name + ',D A,' + stc_name + '" --zosmf-p tso1').read()):
        time.sleep(1)
        cnt += 1

    # If stop didn't work, issue cancel
    if cnt == retry:
        print("Issuing 'CANCEL' for " + stc_name)
        stop = os.popen('bright zos-console issue command' +
                        ' "RO ' + sys_name + ',cancel ' + stc_name + '" --zosmf-p tso1').read()
        if "ACCEPTED" in stop:
            print(stc_name + " canceled.")
        else:
            print("Failed to stop and cancel " + stc_name)
            exit(6)
    else:
        print(stc_name + " stopped.")

# Issue start to OPSKWS31, MZ103OP, and MSZ101OP if they are running
for task in tasks:
    stc_name = task[0]
    sys_name = task[1]
    start = os.popen('bright zos-console issue command ' +
                     '"RO ' + sys_name + ',start ' + stc_name + '" --zosmf-p tso1').read()

for task in tasks:
    stc_name = task[0]
    sys_name = task[1]
    # Wait for task to start
    retry = 30
    cnt = 0
    while cnt < retry and ((stc_name + " NOT FOUND") in os.popen('bright zos-console issue command ' +
                                                '"RO ' + sys_name + ',D A,' + stc_name + '" --zosmf-p tso1').read()):
        time.sleep(1)
        cnt += 1

    # If stop didn't work, issue cancel
    if cnt == retry:
        print("Failed to start task " + stc_name)
        exit(4)
    else:
        print(stc_name + " started.")

print("MTCA QA Environment recycled successfully.")
exit(0)