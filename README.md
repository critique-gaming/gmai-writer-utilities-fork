# chatterbox

Test Alexa's voice responses directly in Visual Studio Code

[Install](https://marketplace.visualstudio.com/items?itemName=sjodle.chatterbox)

## Features

Select a block of text or SSML in the editor and select `Speak Selected SSML` in the Command Palette or right-click menu.

Uses AWS Polly to speak text/SSML in a way that closely approximates Amazon Alexa's voice.

## Requirements

- AWS credentials stored in `~/.aws/credentials`. Credentials must have access to Polly.

## Known Issues

- On macOS, the first time you use the extension, you will receive a prompt asking permission to control QuickTime Player. This is required to play the audio files produced by Polly. Subsequent runs will succeed without a prompt.

## Extension Settings

- `chatterbox.awsProfile`: Name of AWS profile, as defined in `~/.aws/credentials`
- `chatterbox.awsRegion`: AWS region to use
- `chatterbox.pollyVoice`: Name of AWS Polly voice to use

## Release Notes

### 1.0.0

Initial release