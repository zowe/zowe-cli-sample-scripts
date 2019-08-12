import {exec} from "child_process";

export function executeCommand(command: string){
    return new Promise((resolve, reject) =>{
      exec(command, (err, sdtout, stderr) =>{
        if (err) reject(err);
        if (sdtout) resolve(sdtout);
        if (stderr) reject(stderr);
      });
    });
}
