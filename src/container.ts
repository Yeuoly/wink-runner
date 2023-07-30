import * as vscode from 'vscode';
import * as fs from 'fs';
import { languages } from './language';

export class WinkRunnerDataProvider implements vscode.TreeDataProvider<TempScriptFile> {
    constructor(
        private workspaceRoot: string
    ) { }

	onDidChangeTreeData?: vscode.Event<void | TempScriptFile | TempScriptFile[] | null | undefined> | undefined;

	getTreeItem(element: TempScriptFile): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: TempScriptFile | undefined): vscode.ProviderResult<TempScriptFile[]> {
        if (!element) {
            return Promise.resolve(
                languages.map(v => new TempScriptFile(v.language, vscode.TreeItemCollapsibleState.Collapsed))
            );
        } else {
            // get language
            const language = element.language;
            // get files in language directory
            const files = fs.readdirSync(`${this.workspaceRoot}/.wink-runner/${language}`);
            return Promise.resolve(
                files.map(v => new TempScriptFile(v, vscode.TreeItemCollapsibleState.None))
            );
        }
	}
}

class TempScriptFile extends vscode.TreeItem {
	constructor(
		public readonly language: string,
    	public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
        super(language, collapsibleState);
	}
}