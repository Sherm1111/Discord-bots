// import the discord.js module
const { Client, GatewayIntentBits } = require('discord.js');

require('dotenv').config();

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

// create a new Discord client
const client = new Client({
  // set of permissions that the bot will have
  intents: [
    //guilds are servers in discord
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
});

const roleId = '1214669701603532971';

const openAIKey = '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';

//print to console that bot is logged in
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const responses = ['hello', 'hi', 'hey', 'hi there'];


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content; // Convert to lowercase for case-insensitive comparison

  if (responses.includes(content)) {
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    message.reply(randomResponse);
  }

  if (message.author.username == "sherm1111"){
    message.react('👍');
    //message.reply("Bro you're so smart")
  }
  else if (message.author.username == "spreadsheetmaster"){
    message.react('👎')
  }
  else if (message.author.username == "mellimee"){
    message.react('🤓')
  }
  else if (message.author.username == "kkonaog"){
    message.react('🕶️')
  }


  if (message.content.toLowerCase() === '!assignrole') {
    // Send a message with a reaction that users can click to get the role
    const roleMessage = await message.channel.send('React to this message to get the role!');
    roleMessage.react('✅'); // You can use any emoji here

    // Set up a reaction collector
    const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot;
    const collector = roleMessage.createReactionCollector({ filter, time: 60000 }); // Collect reactions for 60 seconds

    collector.on('collect', async (reaction, user) => {
      // Get the member who reacted
      const member = await message.guild.members.fetch(user.id);

      // Assign the role
      const role = message.guild.roles.cache.get(roleId);
      if (role) {
        member.roles.add(role);
        message.channel.send(`Role ${role.name} assigned to ${member.user.tag}.`);
      } else {
        message.channel.send('Role not found. Please check the role ID in the code.');
      }

    });

    collector.on('remove', async (reaction, user) => {
      // Get the member who removed the reaction
      const member = await message.guild.members.fetch(user.id);

      // Remove the role
      const role = message.guild.roles.cache.get(roleId);
      if (role) {
        member.roles.remove(role);
        message.channel.send(`Role ${role.name} removed from ${member.user.tag}.`);
      } else {
        message.channel.send('Role not found. Please check the role ID in the code.');
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        message.channel.send('Role assignment time expired.');
      }
    });
  }

});

function rockPaperScissors(userChoice){
  if (!['rock', 'paper', 'scissors'].includes(userChoice)) {
    message.reply('Please choose either rock, paper, or scissors!');
    return;
  }

  // Bot's choice
  const choices = ['rock', 'paper', 'scissors'];
  const botChoice = choices[Math.floor(Math.random() * choices.length)];

  // Determine the winner
  let result;
  if (userChoice === botChoice) {
    result = 'It\'s a tie!';
  } else if (
    (userChoice === 'rock' && botChoice === 'scissors') ||
    (userChoice === 'paper' && botChoice === 'rock') ||
    (userChoice === 'scissors' && botChoice === 'paper')
  ) {
    result = 'You win!';
  } else {
    result = 'You lose!';
  }

  // Reply with the result
  return (`You chose ${userChoice}, I chose ${botChoice}. ${result}`);
}


client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'rps') {
    const userChoice = interaction.options.getString('choice');
    const result = rockPaperScissors(userChoice);
    interaction.reply(result);
  }else if (commandName === 'ping') {
    interaction.reply('Pong!');
  }else if (commandName === 'openai') {
    const question = interaction.options.getString('question');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: question
        }
      ]
    }).then(response => {
      console.log("AI responded");
      interaction.reply(response.choices[0].message.content);
    })
    
  }
  
});

//login with token
client.login(process.env.TOKEN);

