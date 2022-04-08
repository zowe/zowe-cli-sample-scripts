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

/**
 * The following pipeline is an example of using Zowe CLI 
 * to download z/OS source files contained in MVS data sets
 * and analyze with SonarQube.
 * 
 * The pipeline assumes the following config/setup:
 * 1. You have a docker build agent with Node.js and npm
 * 2. You have configured a set of Jenkins secure credentials
 *    with your mainframe TSO userid and password (for use 
 *    with Zowe CLI)
 * 3. You have the SonarQube Jenkins plugin installed and 
 *    configured with a server named "sonar enterprise test"
 * 4. You have the SonarScanner 4.0 Jenkins tool installed
 * 5. You have configured the SonarQube webhook for 
 *    your Jenkins instance 
 *
 * The pipeline was tested with the container/image OS
 * ubuntu:xenial.
 * 
 * Customize the following variables for your environment. 
 */

// The label name of your Jenkins build agent
def PIPELINE_AGENT_LABEL = "ca-jenkins-agent"

// The ID of the secure credentials for yor target z/OSMF
def MAINFRAME_CREDENTIAL_ID = "MBAUTO-mainframe"

pipeline {
    agent {
        label "${PIPELINE_AGENT_LABEL}"
    }

    stages {
        /************************************************************************
         * STAGE
         * -----
         * Install Zowe CLI
         *
         * TIMEOUT
         * -------
         * 10 Minutes
         *
         * DESCRIPTION
         * -----------
         * Install Zowe CLI globally in the container. This isn't required if 
         * you are using a image/container that already contains the CLI.
         *
         ************************************************************************/
        stage('Install Zowe CLI') {
            steps('Install Zowe CLI') {
                timeout(time: 10, unit: 'MINUTES') {
                    echo "Install Zowe CLI globally"
                    sh "npm install -g @zowe/cli@latest"
                    sh "zowe --version"
                }
            }
        }

        /************************************************************************
         * STAGE
         * -----
         * download
         *
         * TIMEOUT
         * -------
         * 10 Minutes
         *
         * DESCRIPTION
         * -----------
         * Using Zowe CLI, downloads all members of the data sets specified.
         *
         ************************************************************************/
        stage('download') {
            steps('download') {
                timeout(time: 10, unit: 'MINUTES') {
                    withCredentials([usernamePassword(credentialsId: MAINFRAME_CREDENTIAL_ID, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh "npm run download -- --user ${USERNAME} --password ${PASSWORD}"
                    }
                }
            }
        }

        /************************************************************************
         * STAGE
         * -----
         * sonar
         *
         * TIMEOUT
         * -------
         * 10 Minutes
         *
         * DESCRIPTION
         * -----------
         * Using the sonar-scanner, scan the COBOL datasets downloaded. 
         *
         ************************************************************************/
        stage('sonar') {
            steps('sonar') {
                timeout(time: 10, unit: 'MINUTES') {
                    script {
                        withSonarQubeEnv('sonar enterprise test') {
                            def scannerHome = tool 'SonarScanner 4.0'
                            sh "${scannerHome}/bin/sonar-scanner"
                        }
                    }
                }
            }
        }

        /************************************************************************
         * STAGE
         * -----
         * Quality Gate
         *
         * TIMEOUT
         * -------
         * 10 Minutes
         *
         * DESCRIPTION
         * -----------
         * Using the SonarQube plugin, pause the build and wait for the results
         * of the SonarQube scan. Failing the build if the scan status is not OK.
         *
         ************************************************************************/
        stage('quality gate') {
            steps('quality gate') {
                timeout(time: 10, unit: 'MINUTES') {
                    script {
                        def qg = waitForQualityGate();
                        if (qg.status != 'OK') {
                            error "SonarQube quality gate status: ${qg.status}"
                        }
                    }
                }
            }
        }
    }
}