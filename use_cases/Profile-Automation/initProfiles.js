/*
 * This program and the accompanying materials are made available and may be used, at your option, under either: *
 * * Eclipse Public License v2.0, available at https://www.eclipse.org/legal/epl-v20.html, OR *
 * * Apache License, version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0 *
 *                                                                                       *
 * SPDX-License-Identifier: EPL-2.0 OR Apache-2.0                                        *
 *                                                                                       *
 * Copyright Contributors to the Zowe Project.                                           *
 *                                                                                       *
 */

var config = require('./config.json'),
    readlineSync = require('readline-sync');

//exec will enable use to leverage CLI commands
const { exec } = require('child_process');

/**
 *
 * @callback requestCallback
 * @param {ExecException|string} err
 */

/**
* Runs command and calls back without error if successful
* @param {string}           command   command to run
* @param {requestCallback}  callback  function to call after completion
*/
function simpleCommand(command, callback) {
    exec(command, (err, data, stderr) => {
        if (err) {
            callback(err);
        } else if (stderr) {
            callback(new Error("\nCommand:\n" + command + "\n" + stderr + "Stack Trace:"));
        } else {
            callback();
        }
    });
}

/**
 * Submits multiple simple commands
 * @param {string[]}        commands Array of commands
 * @param {requestCallback} callback function to call after completion
 */
function submitMultipleCommands(commands, callback) {
    if (commands.length > 0) {
        simpleCommand(commands[0], function (err) {
            if (err) {
                callback(err);
            } else {
                commands.shift();
                submitMultipleCommands(commands, callback);
            }
        });
    } else {
        callback();
    }
}

/**
 * Creates zw (Zowe-Workshop) profiles for project and sets them as default
 * @param {string}           user     username
 * @param {string}           pass     password
 * @param {requestCallback}  callback function to call after completion
 */
function createAndSetProfiles(user, pass, callback){
    var commands = [
        "zowe profiles create zosmf demo --host " + config.zosmfHost + " --user " + user + " --pass " +
        pass + " --port " + config.zosmfPort + " --ru " + config.zosmfRejectUnauthorized + " --ow",

        "zowe profiles set zosmf demo",

        "zowe profiles create endevor demo --host " + config.endevorHost + " --user " + user + " --pass " +
        pass + " --port " + config.endevorPort + " --ru " + config.endevorRejectUnauthorized +
        " --protocol " + config.endevorProtocol + " --ow",

        "zowe profiles set endevor demo",

        "zowe profiles create endevor-location demo --instance " + config.endevorLocationInstance +
        " --environment " + config.endevorLocationEnvironment + " --system " + config.endevorLocationSystem +
        " --subsystem " + config.endevorLocationSubsystem + " --ow",

        "zowe profiles set endevor-location demo"
    ];
    submitMultipleCommands(commands, callback);
}

//Prompt for username and password
var user = readlineSync.question('Username: '),
    pass = readlineSync.question('Password: ', { hideEchoBack: true });

createAndSetProfiles(user, pass, function (err) {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        console.log("Profiles successfully initialized.");
    }
});