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
import { IZoweTreeNode, imperative } from "@zowe/zowe-explorer-api";
// import * as imperative from "@zowe/imperative";
// const imperative: any = require("@zowe/imperative");

export function activate(context: vscode.ExtensionContext) {
    // TO DO:
    // [x] zowe watcher (subscribe and unsubscribe)
    // [x] custom watcher (subscribe and unsubscribe)
    // [x] custom emitters (emit)

    const customApp = "custom-app";
    //////////////////////////////////////////////////////////////
    // Simulated Event Emission
    //////////////////////////////////////////////////////////////
    const eventZoweUser = "onVaultChanged";
    const eventZoweShared = "onCredentialManagerChanged";
    const eventExtenderUser = "extenderUserEvent";
    const eventExtenderShared = "extenderSharedEvent";

    const tryCatch = (cb: any): any => {
        try { return cb(); } catch (err) { vscode.window.showErrorMessage(JSON.stringify(err)); }
    };
    tryCatch(() => {
        (imperative.ConfigUtils as any).writeExtendersJson({ profileTypes: { [customApp]: { from: [ customApp ] } } });
    });
    const zoweEmitter = tryCatch(() => imperative.EventOperator.getEmitter("Zowe"));
    const extenderEmitter = tryCatch(() => imperative.EventOperator.getEmitter(customApp));

    let zoweUserEmits = 0, zoweSharedEmits = 0, extenderUserEmits = 0, extenderSharedEmits = 0;
    const disposableZUE = vscode.commands.registerCommand("menu-item-sample.emitZU", (node: IZoweTreeNode) => {
        tryCatch(() => zoweEmitter.emitEvent(eventZoweUser));
        vscode.window.showInformationMessage("Emission Event [ZU] - number: " + zoweUserEmits++);
    });

    const disposableZSE = vscode.commands.registerCommand("menu-item-sample.emitZS", (node: IZoweTreeNode) => {
        tryCatch(() => zoweEmitter.emitEvent(eventZoweShared));
        vscode.window.showInformationMessage("Emission event [ZS]- number: " + zoweSharedEmits++);
    });

    const disposableEUE = vscode.commands.registerCommand("menu-item-sample.emitEU", (node: IZoweTreeNode) => {
        tryCatch(() => extenderEmitter.emitEvent(eventExtenderUser));
        vscode.window.showInformationMessage("Emission event [EU]- number: " + extenderUserEmits++);
    });

    const disposableESE = vscode.commands.registerCommand("menu-item-sample.emitES", (node: IZoweTreeNode) => {
        tryCatch(() => extenderEmitter.emitEvent(eventExtenderShared));
        vscode.window.showInformationMessage("Emission event [ES]- number: " + extenderSharedEmits++);
    });

    //////////////////////////////////////////////////////////////
    // Subscribe to Zowe Events
    const zoweWatcher = imperative.EventOperator.getWatcher();
    //////////////////////////////////////////////////////////////

    // [Z]owe [U]ser event - "onVaultChanged"
    // subscribe
    const disposableZUS = vscode.commands.registerCommand("menu-item-sample.subscribeZU", (node: IZoweTreeNode) => {
        const watcherZUS = tryCatch(() => zoweWatcher.subscribeUser(eventZoweUser, () => {
            vscode.window.showInformationMessage("Registered callbacks[ZU] - number: " + zoweUserEmits++);
        }));
        vscode.window.showInformationMessage("Subscribed[ZU]");
        context.subscriptions.push(vscode.Disposable.from({ dispose: watcherZUS.close }));
    });
    // unsubscribe
    const disposableZUU = vscode.commands.registerCommand("menu-item-sample.unsubscribeZU", (node: IZoweTreeNode) => {
        tryCatch(() => zoweWatcher.unsubscribe(eventZoweUser));
        zoweUserEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[ZU]");
    });

    // [Z]owe [S]hared event - "onCredentialManagerChanged"
    // subscribe
    const disposableZSS = vscode.commands.registerCommand("menu-item-sample.subscribeZS", (node: IZoweTreeNode) => {
        const watcherZSS = tryCatch(() => zoweWatcher.subscribeShared(eventZoweShared, () => {
            vscode.window.showInformationMessage("Registered callbacks[ZS] - number: " + zoweSharedEmits++);
        }));
        vscode.window.showInformationMessage("Subscribed[ZS]");
        context.subscriptions.push(vscode.Disposable.from({ dispose: watcherZSS.close }));
    });
    // unsubscribe
    const disposableZSU = vscode.commands.registerCommand("menu-item-sample.unsubscribeZS", (node: IZoweTreeNode) => {
        tryCatch(() => zoweWatcher.unsubscribe(eventZoweShared));
        zoweSharedEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[ZS]");
    });

    //////////////////////////////////////////////////////////////
    // Subscribe to Extender Events
    const extenderWatcher = tryCatch(() => imperative.EventOperator.getWatcher(customApp));
    //////////////////////////////////////////////////////////////

    // [E]xtender [U]ser event - "extenderUserEvent"
    // subscribe
    const disposableEUS = vscode.commands.registerCommand("menu-item-sample.subscribeEU", (node: IZoweTreeNode) => {
        const watcherEUS = tryCatch(() => extenderWatcher.subscribeUser(eventExtenderUser, () => {
            vscode.window.showInformationMessage("Registered callbacks [EU] - number: " + extenderUserEmits++);
        }));
        vscode.window.showInformationMessage("Subscribed[EU]");
        context.subscriptions.push(vscode.Disposable.from({ dispose: watcherEUS.close }));
    });
    // unsubscribe
    const disposableEUU = vscode.commands.registerCommand("menu-item-sample.unsubscribeEU", (node: IZoweTreeNode) => {
        tryCatch(() => extenderWatcher.unsubscribe(eventExtenderUser));
        extenderUserEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[EU]");
    });

    // [E]xtender [S]hared events - "extenderSharedEvent"
    // subscribe
    const disposableESS = vscode.commands.registerCommand("menu-item-sample.subscribeES", (node: IZoweTreeNode) => {
        const watcherESS = tryCatch(() => extenderWatcher.subscribeShared(eventExtenderShared, () => {
            vscode.window.showInformationMessage("Registered callback for emission event [ES] - number: " + extenderSharedEmits++);
        }));
        vscode.window.showInformationMessage("Subscribed[ES]");
        context.subscriptions.push(vscode.Disposable.from({ dispose: watcherESS.close }));
    });
    // unsubscribe
    const disposableESU = vscode.commands.registerCommand("menu-item-sample.unsubscribeES", (node: IZoweTreeNode) => {
        tryCatch(() => extenderWatcher.unsubscribe(eventExtenderShared));
        extenderSharedEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[ES]");
    });

    //////////////////////////////////////////////////////////////
    // cleanup
    context.subscriptions.push(disposableZUE, disposableZUS, disposableZUU);
    context.subscriptions.push(disposableZSE, disposableZSS, disposableZSU);
    context.subscriptions.push(disposableEUE, disposableEUS, disposableEUU);
    context.subscriptions.push(disposableESE, disposableESS, disposableESU);

    //////////////////////////////////////////////////////////////
    // done
    vscode.window.showInformationMessage("Sample extension was activated successfully!");
}
