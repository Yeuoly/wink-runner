import * as vscode from 'vscode';
import * as fs from 'fs';

import { TempScriptFile } from './container';
import { languages } from './language';
import { WinkRunnerDataProvider } from './container';

/**
 * Handles the creation of a new template file or editing of an existing one.
 */
export function registerCommand(context: vscode.ExtensionContext, dataProvider: WinkRunnerDataProvider) {
    const dispose = vscode.commands.registerCommand('wink-runner.openFile', async (item: TempScriptFile) => {
        if(item.is_root) {
            // get language
            const language = languages.find(v => v.language === item.language);
            if(language) {
                // create a new temp script context
                if(language.new_dir_required) {
                    const child_directory = `${item.directory}/temp-${parseInt(`${new Date().getTime()}`)}`;
                    await fs.promises.mkdir(child_directory);
                    // create a new file
                    const child_file = `${child_directory}/main.${language.extension}`;
                    await fs.promises.writeFile(child_file, language.template);
                    // open the file
                    const doc = await vscode.workspace.openTextDocument(child_file);
                    await vscode.window.showTextDocument(doc);
                } else {
                    // create a new file
                    const child_file = `${item.directory}/${parseInt(`${new Date().getTime()}`)}.${language.extension}`;
                    await fs.promises.writeFile(child_file, language.template);
                    // open the file
                    const doc = await vscode.workspace.openTextDocument(child_file);
                    await vscode.window.showTextDocument(doc);
                }
            }
            dataProvider.refresh();
        } else if(!item.is_dir) {
            // open the file
            const doc = await vscode.workspace.openTextDocument(item.directory);
            await vscode.window.showTextDocument(doc);
        }
    });

    context.subscriptions.push(dispose);

    const deleteDisplose = vscode.commands.registerCommand('wink-runner.delFile', async (item: TempScriptFile) => {
        if (!item.is_root) {
            // delete the file or directory
            await fs.promises.rm(item.directory, { recursive: true, force: true });
            // refresh the tree
            vscode.commands.executeCommand('wink-runner.refresh');
        }
    });

    context.subscriptions.push(deleteDisplose);

    const runDispose = vscode.commands.registerCommand('wink-runner.run', async () => {
        // get current file
        const editor = vscode.window.activeTextEditor;
        if(editor) {
            const path = editor.document.uri.fsPath;
            // match the language
            const language = languages.find(v => v.extension === path.split('.').pop());
            if(language) {
                // run the file
                // check if terminal exists
                if (!vscode.window.terminals.length) {
                    vscode.window.createTerminal();
                }
                // get the terminal
                const terminal = vscode.window.terminals[0];
                terminal.sendText(language.command.replace('${file}', path));
                terminal.show();
            }
        }
    });

    context.subscriptions.push(runDispose);
}