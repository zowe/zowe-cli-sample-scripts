"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        child_process_1.exec(command, (err, sdtout, stderr) => {
            if (err)
                reject(err);
            if (sdtout)
                resolve(sdtout);
            if (stderr)
                reject(stderr);
        });
    });
}
exports.executeCommand = executeCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0ZUNvbW1hbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZXhlY3V0ZUNvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBbUM7QUFFbkMsU0FBZ0IsY0FBYyxDQUFDLE9BQWU7SUFDMUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxvQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDcEMsSUFBSSxHQUFHO2dCQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQixJQUFJLE1BQU07Z0JBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksTUFBTTtnQkFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFSRCx3Q0FRQyJ9