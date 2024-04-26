import { ExtensionContext, commands } from 'vscode';
import { LogMessage } from './logger';

export function activate(context: ExtensionContext) {

	console.log('Congratulations, your extension "console-logger" is now active!');

	let disposable = commands.registerCommand('console-logger.helloWorld', LogMessage);

	context.subscriptions.push(disposable);
}