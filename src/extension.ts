import * as vscode from 'vscode';
import * as fs from 'fs';

import { WinkRunnerDataProvider } from './container';
import { languages } from './language';

function init(rootPath: string) {
	// check if wink-runner directory exists
	if (!fs.existsSync(`${rootPath}/.wink-runner`)) {
		// if not, create it
		fs.mkdirSync(`${rootPath}/.wink-runner`);
	}

	// check if each language directory exists
	for (const language of languages) {
		if (!fs.existsSync(`${rootPath}/.wink-runner/${language.language}`)) {
			// if not, create it
			fs.mkdirSync(`${rootPath}/.wink-runner/${language.language}`);
		}

		// check if each template file exists
		if (!fs.existsSync(`${rootPath}/.wink-runner/${language.language}/template.${language.extension}`)) {
			// if not, create it
			fs.writeFileSync(`${rootPath}/.wink-runner/${language.language}/template.${language.extension}`, language.template);
		}
	}

	// check if .gitignore exists, if so, add .wink-runner to it
	if (fs.existsSync(`${rootPath}/.gitignore`)) {
		const gitignore = fs.readFileSync(`${rootPath}/.gitignore`).toString();
		if (!gitignore.includes('.wink-runner')) {
			fs.appendFileSync(`${rootPath}/.gitignore`, '\n.wink-runner');
		}
	} else {
		// if not, create it
		fs.writeFileSync(`${rootPath}/.gitignore`, '.wink-runner');
	}
}

export function activate(context: vscode.ExtensionContext) {
	// get the root path of the workspace
	const rootPath =
    vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;
	
	// if root path exists, initialize wink-runner
	if (rootPath) {
		init(rootPath);
		vscode.window.registerTreeDataProvider('wink-runner', new WinkRunnerDataProvider(rootPath as string));
	} else {
		vscode.window.showErrorMessage('Workspace not found.');
	}
}
