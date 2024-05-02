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

export function activate(context: vscode.ExtensionContext) {
    imperative.ImperativeEventEmitter.initialize("Dummy Extension");
    const iee = imperative.ImperativeEventEmitter.instance;
    const congrats = 'Congratulations, your extension "sample-vsce" is now active!';
    console.log(congrats);
    vscode.window.showInformationMessage(congrats);

    let customSubs = 0;
    const customEvent = "onZoweExplorerEvent";
    const disposable = vscode.commands.registerCommand("sample-vsce.subscribe", (node: IZoweTreeNode) => {
        const cW = iee.subscribe(customEvent, () => {
            vscode.window.showInformationMessage("Emitted - number: " + customSubs++);
        });
        vscode.window.showInformationMessage("Subscribed");
        // context.subscriptions.push(vscode.Disposable.from({dispose: cW.close}));
    });
    const disposable2 = vscode.commands.registerCommand("sample-vsce.unsubscribe", (node: IZoweTreeNode) => {
        iee.unsubscribe(customEvent);
        customSubs = 0;
        vscode.window.showInformationMessage("Unsubscribed");
    });
    const emit = vscode.commands.registerCommand("sample-vsce.emit", (node: IZoweTreeNode) => {
        iee.emitCustomEvent(customEvent);
        vscode.window.showInformationMessage("Emitted");
    });
    context.subscriptions.push(disposable, disposable2, emit);

    const vcW = iee.subscribe(imperative.ImperativeUserEvents.ON_VAULT_CHANGED,  () => {
        vscode.window.showInformationMessage("Vault changed - User updated credentials");
    });
    context.subscriptions.push(vscode.Disposable.from({dispose: vcW.close}));

    // const configWatcher = iee.subscribe("onConfigChanged",  () => {
    //     vscode.window.showInformationMessage("Config changed - Profile was modified");
    // });
    // context.subscriptions.push(vscode.Disposable.from({dispose: configWatcher.close}));

    const cmW = iee.subscribe(imperative.ImperativeSharedEvents.ON_CREDENTIAL_MANAGER_CHANGED,  () => {
        vscode.window.showInformationMessage("Credential Manager Changed");
    });
    context.subscriptions.push(vscode.Disposable.from({dispose: cmW.close}));

    // const schemaWatcher = iee.subscribe("onSchemaChanged",  () => {
    //     vscode.window.showInformationMessage("Schema changed - Plug-in was just installed");
    // });
    // context.subscriptions.push(vscode.Disposable.from({dispose: schemaWatcher.close}));

    const cW = iee.subscribe(customEvent, () => {
        vscode.window.showInformationMessage("Custom event triggered - initial registration of event");
    });
    context.subscriptions.push(vscode.Disposable.from({dispose: cW.close}));

}
