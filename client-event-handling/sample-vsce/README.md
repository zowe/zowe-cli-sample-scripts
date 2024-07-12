# Sample VSCode Extension

Demonstrates adding a new command to the context menu shown when a tree item is right-clicked in Zowe Explorer.

The `contributes` section of "package.json" defines a few menu items for all tree views that have an ID starting with `zowe.`.

In "extension.ts" many commands are registered which run when the menu item is clicked.

## Running the sample

- Open this sample in VS Code
- `yarn`
- `yarn compile`
- `F5` to start debugging

### Debugging Imperative Changes

When making changes to the Imperative package, you need link the version before testing this sample extension. Please add either of the following resolutions.

- Use a package resolution directly from GitHub by updating the `<commit-hash>` to the latest changes on the Imperative codebase.
  ```jsonc
    "resolutions": {
      "@zowe/imperative": "https://gitpkg.now.sh/zowe/zowe-cli/packages/imperative?7730aba8a3344230661722ad9bcf09605f2adcc7"
    },
  ```
- Use a local file path resolution by updating the following path to your locally build, working version
  ```jsonc
    "resolutions": {
      "@zowe/imperative": "file:../../../zowe-cli/packages/imperative"
    },
  ```

**Note:** You will have to execute the command `npm run build:imp` after installing the dependencies (`yarn`) and before running the extension with the debugger (`F5`).

## Glossary

The commands contributed by this sample extension have the following suffixed abbreviations:

- `[ES]`: Refers to _Extender Shared_ events, e.g. `ZOWE_CLI_HOME/.zowe/.events/custom-app/customSharedEvent`
- `[EU]`: Refers to _Extender User_ events, e.g. `~/.zowe/.events/custom-app/customUserEvent`
- `[ZS]`: Refers to _Zowe Shared_ events, e.g. `ZOWE_CLI_HOME/.zowe/.events/Zowe/onCredentialManagerChanged`
- `[ZS]`: Refers to _Zowe User_ events, e.g. `~/.zowe/.events/Zowe/onVaultChanged`

## Screenshots

We will perform all actions (callbacks) with a single trigger if there are multiple subscriptions to the same event
![CustomEvents](res/customEvents.png)

And here is what the subscription map looks like
![AllSubs](res/allSubs.png)


