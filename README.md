# ZNY Discord Bot

# About:
This is a bot that is used to interact with the ZNY discord server.

# Features:
It's a stupid simple bot that responds to the following commands:
 - /foo - Returns "bar"
 - /getroles - Returns a response that this command is not in use.
 - /linkaccount - Returns info about how you can link your discord account to your ZNY account.

# Installation:
Deploy the `lambda_bot` folder to Lambda using the following command:
```bash
cd lambda_bot
zip -r ../lambda_bot.zip *
aws lambda update-function-code --function-name nyartccDiscordBot --zip-file fileb://../lambda_bot.zip
```

# Usage:
With the bot uploaded to lambda, you need to register the command with Discord, this is done from your local machine.

Note, you will need a .env file with the BOT_TOKEN and APP_ID from Discord Developer then the ID of the Discord Guild (Aka. Discord Server)
Update `register_commands/register_command.js` to match the new command, then run it:

```bash
cd register_command
node register_command.js
```

# License: 
MIT