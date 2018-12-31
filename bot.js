// Import the required Node.js modules
const Discord = require(`discord.js`);
const Canvas = require('canvas');

// Import the required JSON files
const auth = require(`./auth.json`);
const opponents = require(`./opponents.json`);
const cards = require(`./cards.json`);

// The dimensions of each card
const CARDHEIGHT = 128;
const CARDWIDTH = 104;

/**
 * Functions
 */

// Draws the current state of the board
async function drawBoard(message) {
  // Set a new canvas to the dimensions of a grid of 3x3 cards
  const canvas = Canvas.createCanvas(CARDWIDTH * 3, CARDHEIGHT * 3);

  // ctx (context) will be used to modify a lot of the canvas
  const ctx = canvas.getContext('2d');

  // Since the image takes time to load, you should await it
  const background = await Canvas.loadImage(`./cards/Amalj'aa.png`);

  // Draws 9 cards in a 3x3 grid
  ctx.drawImage(background, 0,                0,            CARDWIDTH, CARDHEIGHT); // top-left
  ctx.drawImage(background, CARDWIDTH,        0,            CARDWIDTH, CARDHEIGHT); // top-center
  ctx.drawImage(background, CARDWIDTH*2,      0,            CARDWIDTH, CARDHEIGHT); // top-right
  ctx.drawImage(background, 0,                CARDHEIGHT,   CARDWIDTH, CARDHEIGHT); // mid-left
  ctx.drawImage(background, CARDWIDTH,        CARDHEIGHT,   CARDWIDTH, CARDHEIGHT); // mid-center
  ctx.drawImage(background, CARDWIDTH*2,      CARDHEIGHT,   CARDWIDTH, CARDHEIGHT); // mid-right
  ctx.drawImage(background, 0,                CARDHEIGHT*2, CARDWIDTH, CARDHEIGHT); // bottom-left
  ctx.drawImage(background, CARDWIDTH,        CARDHEIGHT*2, CARDWIDTH, CARDHEIGHT); // bottom-center
  ctx.drawImage(background, CARDWIDTH*2,      CARDHEIGHT*2, CARDWIDTH, CARDHEIGHT); // bottom-right

  // Use helpful Attachment class structure to process the file for you
  const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

  // Send the drawn board to the current channel
  message.channel.send(attachment);

  return;
}

/**
 * Main code
 */

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on(`ready`, () => {
  console.log(`I am ready!`);
});

// Create an event listener for messages
client.on(`message`, async message => {
  // If the message is a bot command
  if (message.content.substring(0,3) == `tt!`) {
    args = message.content.substring(3).split(` `);

    switch(args[0]) {
      // If the message is "ping"
      case `ping`:
        // Send "pong" to the same channel
        message.channel.send(`pong`);
        break;
      case `startmatch`:
        if (args.length == 1) {
          message.channel.send(`Opponent name missing.`);
        }
        else {
          message.channel.send(`Match against opponent ${opponents[0].name} starting!`);
        }
        break;
      case `board`:
        drawBoard(message);
        break;
    }

  }
});

// Log the bot in using the token from https://discordapp.com/developers/applications/me
client.login(auth.token);
