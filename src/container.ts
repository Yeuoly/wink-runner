import * as vscode from 'vscode';
import * as fs from 'fs';
import { languages } from './language';

export class WinkRunnerDataProvider implements vscode.TreeDataProvider<TempScriptFile> {
    constructor(
        private workspaceRoot: string
    ) { }

	private _onDidChangeTreeData: vscode.EventEmitter<TempScriptFile | undefined | null | void> = new vscode.EventEmitter<TempScriptFile | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TempScriptFile | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh() {
        this._onDidChangeTreeData.fire();
    }

	getTreeItem(element: TempScriptFile): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: TempScriptFile | undefined): vscode.ProviderResult<TempScriptFile[]> {
        if (!element) {
            return Promise.resolve(
                languages.map(v => new TempScriptFile(v.language, true, `${this.workspaceRoot}/.wink-runner/${v.language}`))
            );
        } else {
            // get language
            const language = element.language;
            // get files in language directory
            const files = fs.readdirSync(element.directory);
            return Promise.resolve(
                files.map(v => {
                    return new TempScriptFile(v, false, `${element.directory}/${v}`);
                })
            );
        }
	}
}

export class TempScriptFile extends vscode.TreeItem {
    public readonly is_dir: boolean;

	constructor(
		public readonly language: string,
        public readonly is_root: boolean = false,
        public readonly directory: string = '',
	) {
        super(language);
        const is_dir = fs.lstatSync(this.directory).isDirectory();
        this.is_dir = is_dir;
        this.collapsibleState = is_dir ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
	}
}