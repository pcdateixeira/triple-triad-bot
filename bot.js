// Import the required Node.js modules
const Discord = require('discord.js');
const fs = require('fs');

// Import the required JSON files
const auth = require('./auth.json');
const opponents = require('./opponents.json');
const cards = require('./cards.json');

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is a bot command
  if (message.content.substring(0,3) == 'tt!') {
    args = message.content.substring(3).split(" ");

    switch(args[0]) {
      // If the message is "ping"
      case 'ping':
        // Send "pong" to the same channel
        message.channel.send('pong');
        break;
      case 'startmatch':
        if (args.length == 1) {
          message.channel.send("Opponent name missing.");
        }
        else {
          message.channel.send(`Match against opponent ${opponents[0].name} starting!`);
        }
        break;
      case 'board':
        var img = fs.readFileSync('./test.jpg');
        var attachment = new Discord.Attachment(img);
        message.channel.send(attachment);
        break;
    }

  }
});

// Log the bot in using the token from https://discordapp.com/developers/applications/me
client.login(auth.token);
