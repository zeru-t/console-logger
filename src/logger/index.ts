import { Position, window, workspace } from 'vscode';

const FUNCTION_REGEX = /^(.*?)(function\s*)?([aA-zZ0-9]+)(\s*)(\(.*\)\s*{).*/;
const CONST_REGEX = /^(.*?)(const\s*)?([aA-zZ0-9]+)(\s*=\s*(async\s*)?\(.*\)\s*=>\s*{)/;
const HOOKS_REGEX = /^(\s*)(const\s*)([aA-zZ0-9]+)(\s*=\s*use.*\(.*\s*{)/;
const EFFECT_REGEX = /^(\s*)(useEffect\(\(\).*{)/;
const INVALID_REGEX = /^(\s*)((if\s*)|(for\s*)|(switch\s*)|(while\s*)|(do\s*))(.*)\s*{.*/;

const OPEN_BRACKET_REGEX = /{/g;
const CLOSED_BRACKET_REGEX = /}/g;

const DEPENDENCIES_REGEX = /^(\s*)(}, \[(.*)]\))/;

export async function LogMessage() {

    const { activeTextEditor, showWarningMessage } = window;

    const editor = activeTextEditor;
    if (!editor) {
        showWarningMessage('No file currently open!');
        return null;
    }

    const selection = editor.selections[0];
    if (!selection || selection.isEmpty) {
        showWarningMessage('No text selected!');
        return null;
    }
    
    const document = editor.document;
    const selectedText = document.getText(selection).trim();
    const selectedTextLineNumber = selection.active.line;
    const logMessageLineNumber = selectedTextLineNumber + 1;
    const position = new Position(logMessageLineNumber, 0);
    
    const selectedTextLine = document.lineAt(selectedTextLineNumber);
    const indentation = selectedTextLine.text.substring(0, selectedTextLine.firstNonWhitespaceCharacterIndex);

    await editor.edit((editBuilder) => { editBuilder.insert(position, CreateLogMessage()); });

    function CreateLogMessage() {

        const addNewLine = logMessageLineNumber === document.lineCount;
        
        const alias = selectedText.split('.').pop()!.replace(/\((.*)\)/, '');
    
        const formattedSelectedVar = `{${alias !== selectedText ? `${alias}: ${selectedText}` : selectedText}}`;
    
        const { outputTerminal, logFunction, quote, color, bgColor, fontSize } = getSettings();

        const options = `'color: ${color}${bgColor ? `; background: ${bgColor}` : ''}${fontSize ? `; font-size: ${fontSize}px` : ''}'`;
        const logMessage = `${indentation}${outputTerminal}.${logFunction}(${quote}%c📝${GetFunction()}:${quote}, ${options}, ${formattedSelectedVar});`;

        return addNewLine ? `\n${logMessage}` : `${logMessage}\n`;
    }
    
    function GetFunction() {
        let lineNumber = selectedTextLineNumber;

        function hasFunctionName(lineText: string) {
            const isInvalid = INVALID_REGEX.test(lineText);
            const isFunction = FUNCTION_REGEX.test(lineText);
            const isConst = CONST_REGEX.test(lineText);
            const isHook = HOOKS_REGEX.test(lineText);
            const isEffect = EFFECT_REGEX.test(lineText);
            return !isInvalid && (isFunction || isConst || isHook || isEffect);
        }

        function inOtherFunction() {
            let closingBracketLineNumber = lineNumber;
            let openBrackets = 0, closedBrackets = 0;
            while (closingBracketLineNumber < document.lineCount) {
                const closingBracketLineText = document.lineAt(closingBracketLineNumber).text;
                openBrackets += closingBracketLineText.match(OPEN_BRACKET_REGEX)?.length ?? 0;
                closedBrackets += closingBracketLineText.match(CLOSED_BRACKET_REGEX)?.length ?? 0;
                
                if (openBrackets === closedBrackets)
                    return selectedTextLineNumber > closingBracketLineNumber;
                
                closingBracketLineNumber++;
            }
            return false;
        }

        function getFunctionName(lineText: string) {

            function getDependencies() {
                let dependenciesLineNumber = lineNumber;
                while (dependenciesLineNumber < document.lineCount) {
                    const dependenciesLineText = document.lineAt(dependenciesLineNumber).text;
                    const dependencies = dependenciesLineText.match(DEPENDENCIES_REGEX);
                    
                    if (dependencies) return dependencies[3];
                    
                    dependenciesLineNumber++;
                }
                return 'N/A';
            }

            let match = lineText.match(FUNCTION_REGEX) ?? lineText.match(CONST_REGEX) ?? lineText.match(HOOKS_REGEX);
            if (match)
                return match[3];
            
            const eMatch = lineText.match(EFFECT_REGEX)?.[0];
            if (eMatch)
                return `useEffect - [${getDependencies()}]`;

            return 'N/A';
        }

        while (--lineNumber >= 0) {
            const lineText = document.lineAt(lineNumber).text;
            if (hasFunctionName(lineText) && !inOtherFunction())
                return getFunctionName(lineText);
        }

        return document.fileName.split('\\').pop();
    }
}

function getSettings() {
    const { color, bgColor, fontSize, quote, outputTerminal, logFunction } = workspace.getConfiguration('ConsoleLogger');
    return { color, bgColor, fontSize: +fontSize, quote, outputTerminal, logFunction } as Settings;
}

interface Settings {
    /**The font color of the logged message.*/
    bgColor: string;
    
    /**The background color of the logged message.*/
    color: string;
    
    /**The font size of the logged message.*/
    fontSize: number;
    
    /**The type of quote to use (double, single, backtick).*/
    quote: string;
    
    /**The output terminal to use (console, Serial).*/
    outputTerminal: string;
    
    /**The logging function to use (log, debug, print, printf, println).*/
    logFunction: string;
}