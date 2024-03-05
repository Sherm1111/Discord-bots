const { REST } = require('discord.js');
const { Routes } = require('discord-api-types/v10');
require('dotenv').config();

const guildIdsString = process.env.GUILD_ID || ''; // Get the string from the environment variable
const guildIds = guildIdsString.split(',').map(id => id.trim()); 

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'rps',
    description: 'Play rock paper scissors with the bot',
    options : [
        {
            name: 'choice',
            description: 'Choose rock, paper, or scissors',
            type: 3,
            required: true,
            choices: [
            {
                name: 'Rock',
                value: 'rock'
            },
            {
                name: 'Paper',
                value: 'paper'
            },
            {
                name: 'Scissors',
                value: 'scissors'
            }
            ]
        }
    ]
  },
  {
    name: 'openai',
    description: 'Ask the bot a question',
    options:
    [
        {
            name: 'question',
            description: 'Ask the bot a question',
            type: 3,
            required: true
        }
    ]
  }
];

const rest = new REST({ version: '10' });
rest.setToken(process.env.TOKEN); // Replace 'YOUR_BOT_TOKEN' with your actual bot token

(async () => {
  try {
    console.log('Started registering slash commands.');
    
    for (let i = 0; i <guildIds.length; i++) {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID,guildIds[i]),
            { body: commands }
        );
    }

    console.log('Successfully registered slash commands.');
  } catch (e) {
    console.error(e);
  }
})();
