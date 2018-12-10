'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

interface IPollyResponse {
    AudioStream: Buffer;
}

const editor = vscode.window.activeTextEditor;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "chatterbox" is now active!');

    let chatterbox = vscode.commands.registerCommand('extension.chatterbox', () => {
        if (editor !== undefined) {
            let selection = editor.document.getText(editor.selection);
            const aws = require('aws-sdk');
            let conf = vscode.workspace.getConfiguration('chatterbox');
            aws.config.credentials = new aws.SharedIniFileCredentials({
                profile: conf.awsProfile
            });
            const polly = new aws.Polly({
                region: conf.awsRegion
            });
            if (`"'`.includes(selection[0])) {
                selection = selection.substring(1);
            }
            if (`"'`.includes(selection[selection.length - 1])) {
                selection = selection.substring(0, selection.length - 2);
            }
            polly.synthesizeSpeech({
                OutputFormat: 'mp3',
                Text: selection,
                TextType: (selection.includes('<speak>')) ? 'ssml' : 'text',
                SampleRate: `8000`,
                VoiceId: conf.pollyVoice
            }, (err: Error, data: IPollyResponse) => {
                
            });
        }
    });

    context.subscriptions.push(chatterbox);
}

// this method is called when your extension is deactivated
export function deactivate() {
}