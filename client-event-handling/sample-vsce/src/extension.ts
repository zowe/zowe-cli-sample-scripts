/*
 * This program and the accompanying materials are made available and may be used, at your option, under either:
 * - Eclipse Public License v2.0, available at https://www.eclipse.org/legal/epl-v20.html, OR
 * - Apache License, version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import * as vscode from "vscode";
import { IZoweTreeNode } from "@zowe/zowe-explorer-api";
import * as imperative from "@zowe/imperative";


export function activate(context: vscode.ExtensionContext) {

    const zoweAppWatcher = imperative.EventEmitterManager.getEmitter('Zowe');
    const customAppWatcher = imperative.EventEmitterManager.getEmitter('customApp');

    ////////////////////////////[U]///////////////////////////////
    // [U]ser event - "onVaultChanged"
    // zoweAppWatcher.subscribeUser('onVaultChanged', callback);
    // zoweAppWatcher.emitEvent('onVaultChanged');
    // zoweAppWatcher.unsubscribe('onVaultChanged');
    /////////////////////////////////////////////////////////////
    let userEmits = 0;
    const eventU = "onVaultChanged";
    // subscribe
    const disposableUS = vscode.commands.registerCommand("menu-item-sample.subscribeU", (node: IZoweTreeNode) => {
        const watcherU = zoweAppWatcher.subscribeUser(eventU, () => {
            vscode.window.showInformationMessage("Registered callback for emission event [U] - number: " + userEmits++);
        });
        vscode.window.showInformationMessage("Subscribed[U]");
        context.subscriptions.push(vscode.Disposable.from({dispose: watcherU.close}));
    });
    // emit
    const disposableUE = vscode.commands.registerCommand("menu-item-sample.emitU", (node: IZoweTreeNode) => {
        zoweAppWatcher.emitEvent(eventU);
        vscode.window.showInformationMessage("Emission event [U] - number: " + userEmits++);
    });
    // unsubscribe
    const disposableUU = vscode.commands.registerCommand("menu-item-sample.unsubscribeU", (node: IZoweTreeNode) => {
        zoweAppWatcher.unsubscribe(eventU);
        userEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[U]");
    });
    // cleanup
    context.subscriptions.push(disposableUE, disposableUS, disposableUU);


    ////////////////////////////////[S]////////////////////////////////////////
    // [S]hared event - "onCredentialManagerChanged"
    // zoweAppWatcher.subscribeShared('onCredentialManagerChanged', callback);
    // zoweAppWatcher.emitEvent('onCredentialManagerChanged');
    // zoweAppWatcher.unsubscribe('onCredentialManagerChanged');
    //////////////////////////////////////////////////////////////////////////
    let sharedEmits = 0;
    const eventS = "onCredentialManagerChanged";
    // subscribe
    const disposableSS = vscode.commands.registerCommand("menu-item-sample.subscribeS", (node: IZoweTreeNode) => {
        const watcherS = zoweAppWatcher.subscribeShared(eventS, () => {
            vscode.window.showInformationMessage("Registered callback for emission event [S] - number: " + sharedEmits++);
        });
        vscode.window.showInformationMessage("Subscribed[S]");
        context.subscriptions.push(vscode.Disposable.from({dispose: watcherS.close}));
    });
    // emit
    const disposableSE = vscode.commands.registerCommand("menu-item-sample.emitS", (node: IZoweTreeNode) => {
        zoweAppWatcher.emitEvent(eventS);
        vscode.window.showInformationMessage("Emission event [S]- number: " + sharedEmits++);
    });
    // unsubscribe
    const disposableSU = vscode.commands.registerCommand("menu-item-sample.unsubscribeS", (node: IZoweTreeNode) => {
        zoweAppWatcher.unsubscribe(eventS);
        sharedEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[S]");
    });
    // cleanup
    context.subscriptions.push(disposableSE, disposableSS, disposableSU);


    //////////////////////////////////[CU]/////////////////////////////////////
    // [C]ustom [U]ser event - "customUserEvent"
    // customAppWatcher.subscribeShared('onCredentialManagerChanged', callback);
    // customAppWatcher.emitEvent('onCredentialManagerChanged');
    // customAppWatcher.unsubscribe('onCredentialManagerChanged');
    //////////////////////////////////////////////////////////////////////////
    let custUserEmits = 0;
    const eventCU = "customUserEvent";
    // subscribe
    const disposableCUS = vscode.commands.registerCommand("menu-item-sample.subscribeCU", (node: IZoweTreeNode) => {
        const watcherCU = customAppWatcher.subscribeUser(eventCU, () => {
            vscode.window.showInformationMessage("Registered callback for emission event [CU] - number: " + custUserEmits++);
        });
        vscode.window.showInformationMessage("Subscribed[CU]");
        context.subscriptions.push(vscode.Disposable.from({dispose: watcherCU.close}));
    });
    // emit
    const disposableCUE = vscode.commands.registerCommand("menu-item-sample.emitCU", (node: IZoweTreeNode) => {
        customAppWatcher.emitEvent(eventCU);
        vscode.window.showInformationMessage("Emission event [CU]- number: " + custUserEmits++);
    });
    // unsubscribe
    const disposableCUU = vscode.commands.registerCommand("menu-item-sample.unsubscribeCU", (node: IZoweTreeNode) => {
        customAppWatcher.unsubscribe(eventCU);
        custUserEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[CU]");
    });
    // cleanup
    context.subscriptions.push(disposableCUE, disposableCUS, disposableCUU);


    //////////////////////////////////[CS]////////////////////////////////////
    // [C]ustom [S]hared events - "customSharedEvent"
    // customAppWatcher.subscribeShared('onCredentialManagerChanged', callback);
    // customAppWatcher.emitEvent('onCredentialManagerChanged');
    // customAppWatcher.unsubscribe('onCredentialManagerChanged');
    //////////////////////////////////////////////////////////////////////////
    let custSharedEmits = 0;
    const eventCS = "customSharedEvent";
    // subscribe
    const disposableCSS = vscode.commands.registerCommand("menu-item-sample.subscribeCS", (node: IZoweTreeNode) => {
        const watcherCUS = customAppWatcher.subscribeUser(eventCS, () => {
            vscode.window.showInformationMessage("Registered callback for emission event [CS] - number: " + custSharedEmits++);
        });
        vscode.window.showInformationMessage("Subscribed[CS]");
        context.subscriptions.push(vscode.Disposable.from({dispose: watcherCUS.close}));
    });
    // emit
    const disposableCSE = vscode.commands.registerCommand("menu-item-sample.emitCS", (node: IZoweTreeNode) => {
        customAppWatcher.emitEvent(eventCS);
        vscode.window.showInformationMessage("Emission event [CS]- number: " + custSharedEmits++);
    });
    // unsubscribe
    const disposableCSU = vscode.commands.registerCommand("menu-item-sample.unsubscribeCS", (node: IZoweTreeNode) => {
        customAppWatcher.unsubscribe(eventCS);
        custSharedEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[CS]");
    });
    // cleanup
    context.subscriptions.push(disposableCSE, disposableCSS, disposableCSU);
}
