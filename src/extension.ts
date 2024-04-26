import { ExtensionContext, commands } from 'vscode';
import { LogMessage } from './logger';

export function activate(context: ExtensionContext) {
	let disposable = commands.registerCommand('ConsoleLogger.Log', LogMessage);
	context.subscriptions.push(disposable);
}