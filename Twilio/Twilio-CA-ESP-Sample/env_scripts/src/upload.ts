#! /bin/env node

import * as config from "config";
import { basename, extname } from "path";
import { existsSync } from "fs";
import { exec } from "child_process";

const hlq: string = config.get("zos_src.dsn.hlq");
const project: string = config.get("zos_src.dsn.project");
const type: string = config.get("zos_src.dsn.type");
const pdsName: string = `${hlq}.${project}.${type}`;

const inputSource: string = process.argv[2];
if(inputSource) uploadSource(inputSource, pdsName);

async function uploadSource(filePath: string, pdsName: string) {
    if(existsSync(filePath)){
        const memberName = basename(filePath, extname(filePath));
        const zosTarget = `${pdsName}(${memberName})`;
        issueUploadCommand(filePath, zosTarget)
            .then((output) => console.log(output))
            .catch((err) => console.error(err));
    } else {
        console.error(`Input source path not found: ${filePath}`);
    }
}

function issueUploadCommand(localFile: string, dataSet: string) {
    return new Promise((resolve, reject) =>{
        const cmd = `zowe files upload ftds "${localFile}" "${dataSet}"`;
        console.log(`Uploading file ${localFile} to PDS ${dataSet}`);
        exec(cmd, (err, stdout, stderr) => {
            if (err) reject(err);
            if (stdout) resolve(stdout.toString());
            if (stderr) reject(stderr.toString());
        });
    });
}
