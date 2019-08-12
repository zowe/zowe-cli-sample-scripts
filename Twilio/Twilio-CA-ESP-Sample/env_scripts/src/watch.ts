#! /bin/env node
// Script used to watch the source folder and upload the changes to z/OS automatically

import {executeCommand} from "./executeCommand"
import * as config from "config";
const nodemon = require("nodemon");

nodemon({
    ext: "jcl rex txt",
    watch: config.get("zos_src.local.folder"),
    exec: "echo Watching for changes"
});

nodemon.on('restart', uploadFile);

async function uploadFile(filePath: string){
  const cmd: string = `npm run upload ${filePath}`;
  executeCommand(cmd)
    .then((output) => console.log(output))
    .catch((err) => console.error(err));
}
