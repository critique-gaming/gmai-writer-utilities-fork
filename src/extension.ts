'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as child from 'child_process';

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
                VoiceId: conf.pollyVoice
            }, (err: Error, data: IPollyResponse) => {
                if (err) {
                    vscode.window.showErrorMessage(`Speech synthesis error: ${err}`);
                    console.error(err, err.stack);
                } else {
                    const tmp = require('tmp');
                    tmp.file({prefix: 'chatterbox-', postfix: '.mp3'}, (err: Error, path: string, fd: number, cleanup: Function) => {
                        if (err) {
                            vscode.window.showErrorMessage(`Tempfile create error: ${err}`);
                            console.error(err, err.stack);
                        } else {
                            fs.write(fd, data.AudioStream, (err: Error, written: number, string: string) => {
                                if (err) {
                                    vscode.window.showErrorMessage(`Tempfile write error: ${err}`);
                                    console.error(err, err.stack);
                                } else {
                                    fs.close(fd, (err) => {
                                        if (err) {
                                            vscode.window.showErrorMessage(`Tempfile close error: ${err}`);
                                            console.error(err, err.stack);
                                        } else {
                                            let cmd = '';
                                            switch (process.platform) {
                                                case 'darwin': {
                                                    cmd = `osascript -e 'tell application "QuickTime Player"' -e 'set theMovie to open POSIX file "${path}"' -e 'tell theMovie to play' -e 'end tell'`;
                                                    break;
                                                }
                                                case 'win32': {
                                                    cmd = `start ${path}`;
                                                    break;
                                                }
                                                default: {
                                                    cmd = `xdg-open ${path}`;
                                                    break;
                                                }
                                            }
                                            console.log(`Open command: ${cmd}`);
                                            child.exec(cmd, {}, (err: Error | null, stdout: string, stderr: string) => {
                                                if (err) {
                                                    vscode.window.showErrorMessage(`Launch error: ${err}`);
                                                    console.log(`Launch stdout: ${stdout}`);
                                                    console.error(`Launch stderr: ${stderr}`);
                                                    console.error(err, err.stack);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    context.subscriptions.push(chatterbox);
}

// this method is called when your extension is deactivated
export function deactivate() {
}