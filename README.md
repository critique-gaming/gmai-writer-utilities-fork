# chatterbox

Test Alexa's voice responses directly in Visual Studio Code

[Install](https://marketplace.visualstudio.com/items?itemName=sjodle.chatterbox)

## Features

Select a block of text or SSML in the editor and select `Speak Selected SSML` in the Command Palette or right-click menu.

Uses AWS Polly to speak text/SSML in a way that closely approximates Amazon Alexa's voice.

## Requirements

- AWS credentials stored in environment variables or in `~/.aws/credentials`. Credentials must have access to Polly.

## Extension Settings

- `chatterbox.awsProfile`: Name of AWS profile, as defined in `~/.aws/credentials`
- `chatterbox.awsRegion`: AWS region to use
- `chatterbox.pollyVoice`: Name of AWS Polly voice to use

## Release Notes

### 1.0.0

Initial release