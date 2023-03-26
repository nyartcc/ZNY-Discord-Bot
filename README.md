# ZNY Discord Bot

# About:
This is a bot that is used to interact with the ZNY discord server.

# Features:
It's a stupid simple bot that responds to the following commands:

| Command      | Description                                                                   | 
|--------------|-------------------------------------------------------------------------------|
| /znyhelp     | General Help for this bot                                                     |
| /getroles    | Not in use, but lets the user know how to accomplish the same task.           |
| /linkaccount | Returns info about how you can link your discord account to your ZNY account. |
| /commands    | Returns a link to a list of commands                                          |
| /staff       | Returns a link to a the ARTCC staff list                                      |
| /cinnamon    | Returns a Cinnamon/Cinnante quote                                             |
| /karlisgreat | Returns a Karl quote                                                          |
| /gizep       | Returns a Gizep quote                                                         |
| /gabe        | Returns a Gabe quote                                                          |
| /metar       | Returns a METAR for the specified field (Option `icao_code` is required)      |
| /jfkpilots   | Tells you how they're not that bad.                                           |
| /faq         | Pulls the FAQ, formats and returns them.                                      |
| /n90wx       | Gets a METAR for the 3 N90 major fields.                                      |


# Installation:
Deploy the `lambda_bot` folder to Lambda using the following command:
```bash
cd serverless_discord/lambda_bot
zip -r ../lambda_bot.zip *
aws lambda update-function-code --function-name nyartccDiscordBot --zip-file fileb://../lambda_bot.zip
rm ../lambda_bot.zip
```

# Usage:
With the bot uploaded to lambda, you need to register the command with Discord, this is done from your local machine.

Note: you will need a .env file in the `register_commands` directory with the BOT_TOKEN and APP_ID from Discord Developer then the ID of the Discord Guild (Aka. Discord Server)
Update `serverless_discord/register_commands/register.js` to match the new command:

```javascript
let command_data = {
    "name": "<your command name here>",
    "description": "<The decription that will be shown in Discord when users start typing the command name>",
    
    // Optional - This is used to add a subcommand to the command if you need it. Example: /metar <ICAO>
    // Remove this (or comment it out) if you don't need it.
    "options": [
        {
            "name": "foo",
            "description": "The foo to echo back",
            "type": 3,
            "required": true
        }
    ]
}
```

then run it:

```bash
cd serverless_discord/register_commands
node register.js
```

# License: 
MIT