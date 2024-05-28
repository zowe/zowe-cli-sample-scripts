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
    // TO DO:
    // [] zowe watcher (subscribe and unsubscribe)
    // [] custom watcher (subscribe and unsubscribe)
    // [] custom emitters (emit)

    //////////////////////////////////////////////////////////////
    // Simulated Event Emission
    //////////////////////////////////////////////////////////////
    const eventZoweUser = "onVaultChanged";
    const eventZoweShared = "onCredentialManagerChanged";
    const eventExtenderUser = "extenderUserEvent";
    const eventExtenderShared = "extenderSharedEvent";

    const zoweEmitter = imperative.EventOperator.getEmitter();
    const extenderEmitter = imperative.EventOperator.getEmitter('customApp');

    let zoweUserEmits = 0, zoweSharedEmits = 0, extenderUserEmits = 0, extenderSharedEmits = 0;

    const disposableZUE = vscode.commands.registerCommand("menu-item-sample.emitZU", (node: IZoweTreeNode) => {
        zoweEmitter.emitEvent(eventZoweUser);
        vscode.window.showInformationMessage("Emission Event [ZU] - number: " + zoweUserEmits++);
    });

    const disposableZSE = vscode.commands.registerCommand("menu-item-sample.emitZS", (node: IZoweTreeNode) => {
        zoweEmitter.emitEvent(eventZoweShared);
        vscode.window.showInformationMessage("Emission event [ZS]- number: " + zoweSharedEmits++);
    });

    const disposableEUE = vscode.commands.registerCommand("menu-item-sample.emitEU", (node: IZoweTreeNode) => {
        extenderEmitter.emitEvent(eventExtenderUser);
        vscode.window.showInformationMessage("Emission event [EU]- number: " + extenderUserEmits++);
    });

    const disposableESE = vscode.commands.registerCommand("menu-item-sample.emitES", (node: IZoweTreeNode) => {
        extenderEmitter.emitEvent(eventExtenderShared);
        vscode.window.showInformationMessage("Emission event [ES]- number: " + extenderSharedEmits++);
    });

    //////////////////////////////////////////////////////////////
    // Subscribe to Zowe Events
    const zoweWatcher = imperative.EventOperator.getZoweWatcher();
    //////////////////////////////////////////////////////////////

    // [Z]owe [U]ser event - "onVaultChanged"
    // subscribe
    const disposableZUS = vscode.commands.registerCommand("menu-item-sample.subscribeZU", (node: IZoweTreeNode) => {
        const watcherZU = zoweWatcher.subscribeUser(eventZoweUser, () => {
            vscode.window.showInformationMessage("Registered callbacks[ZU] - number: " + zoweUserEmits++);
        });
        vscode.window.showInformationMessage("Subscribed[ZU]");
        context.subscriptions.push(vscode.Disposable.from({dispose: watcherZU.close}));
    });
    // unsubscribe
    const disposableZUU = vscode.commands.registerCommand("menu-item-sample.unsubscribeZU", (node: IZoweTreeNode) => {
        zoweWatcher.unsubscribe(eventZoweUser);
        zoweUserEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[U]");
    });


    // [Z]owe [S]hared event - "onCredentialManagerChanged"
    // subscribe
    const disposableZSS = vscode.commands.registerCommand("menu-item-sample.subscribeS", (node: IZoweTreeNode) => {
        const watcherZS = zoweWatcher.subscribeShared(eventZoweShared, () => {
            vscode.window.showInformationMessage("Registered callbacks[ZS] - number: " + zoweSharedEmits++);
        });
        vscode.window.showInformationMessage("Subscribed[ZS]");
        context.subscriptions.push(vscode.Disposable.from({dispose: watcherZS.close}));
    });
    // unsubscribe
    const disposableZSU = vscode.commands.registerCommand("menu-item-sample.unsubscribeZS", (node: IZoweTreeNode) => {
        zoweWatcher.unsubscribe(eventZoweShared);
        zoweSharedEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[ZS]");
    });


    //////////////////////////////////////////////////////////////
    // Subscribe to Extender Events
    const extenderWatcher = imperative.EventOperator.getWatcher('customApp');
    //////////////////////////////////////////////////////////////

    // [E]xtender [U]ser event - "extenderUserEvent"
    // subscribe
    const disposableEUS = vscode.commands.registerCommand("menu-item-sample.subscribeEU", (node: IZoweTreeNode) => {
        const watcherEU = extenderWatcher.subscribeUser(eventExtenderUser, () => {
            vscode.window.showInformationMessage("Registered callbacks [EU] - number: " + extenderUserEmits++);
        });
        vscode.window.showInformationMessage("Subscribed[EU]");
        context.subscriptions.push(vscode.Disposable.from({dispose: watcherEU.close}));
    });
    // unsubscribe
    const disposableEUU = vscode.commands.registerCommand("menu-item-sample.unsubscribeEU", (node: IZoweTreeNode) => {
        extenderWatcher.unsubscribe(eventExtenderUser);
        extenderUserEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[EU]");
    });

    // [E]ustom [S]hared events - "extenderSharedEvent"
    // subscribe
    const disposableESS = vscode.commands.registerCommand("menu-item-sample.subscribeCS", (node: IZoweTreeNode) => {
        const watcherEUS = extenderWatcher.subscribeUser(eventExtenderShared, () => {
            vscode.window.showInformationMessage("Registered callback for emission event [ES] - number: " + extenderSharedEmits++);
        });
        vscode.window.showInformationMessage("Subscribed[ES]");
        context.subscriptions.push(vscode.Disposable.from({dispose: watcherEUS.close}));
    });
    // unsubscribe
    const disposableESU = vscode.commands.registerCommand("menu-item-sample.unsubscribeCS", (node: IZoweTreeNode) => {
        extenderWatcher.unsubscribe(eventExtenderShared);
        extenderSharedEmits = 0;
        vscode.window.showInformationMessage("Unsubscribed[ES]");
    });

    //////////////////////////////////////////////////////////////
    // cleanup
    context.subscriptions.push(disposableZUE, disposableZUS, disposableZUU);
    context.subscriptions.push(disposableZSE, disposableZSS, disposableZSU);
    context.subscriptions.push(disposableEUE, disposableEUS, disposableEUU);
    context.subscriptions.push(disposableESE, disposableESS, disposableESU);
}
