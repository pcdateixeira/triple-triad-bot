// Import the required Node.js modules
const Discord = require(`discord.js`);
const Canvas = require('canvas');

// Import the required JSON files
const Auth = require(`./auth.json`);
const Opponents = require(`./opponents.json`);
const Cards = require(`./cards.json`);

// Fixed values used throughout the code
const CARDHEIGHT = 128; // pixels
const CARDWIDTH = 104; // pixels
const DECKSIZE = 5;

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

// Creates a deck for an opponent
async function createDeck(message, opponent) {
  var deck = [];

  // Creates a list of card names
  deck = Opponents[opponent].requiredCards.slice(0); // Adds the opponent's required cards to the deck
  var numberMissing = DECKSIZE - deck.length; // Sees how many cards are missing to complete the deck...
  var remainingCards = Opponents[opponent].optionalCards.slice(0); // and gets the cards that can still be part of the deck.

  for (j = 0; j < numberMissing; j++) {
    var rand = Math.floor(Math.random() * remainingCards.length); // Finds a random index for one of the optional cards
    deck.push(remainingCards.splice(rand, 1)); // Removes that card from the remaining cards list while simultaneously adding it to the deck
  }

  // Now that it has the card names, gets the other card stats
  for (i = 0; i < DECKSIZE; i++) {
    var cardName = deck[i]; // Saves the name before it gets replaced in the line below
    deck[i] = Cards[deck[i]]; // Gets the card's info
    deck[i].name = cardName; // Adds a "name" property to the info
  }

  // Creates a string detailing the created deck
  text = `Here is your opponent's deck:
• ${deck[0].name} (${"☆".repeat(deck[0].star)}, ${deck[0].type},  ↑${deck[0].up}, →${deck[0].right}, ↓${deck[0].down}, ←${deck[0].left})
• ${deck[1].name} (${"☆".repeat(deck[1].star)}, ${deck[1].type},  ↑${deck[1].up}, →${deck[1].right}, ↓${deck[1].down}, ←${deck[1].left})
• ${deck[2].name} (${"☆".repeat(deck[2].star)}, ${deck[2].type},  ↑${deck[2].up}, →${deck[2].right}, ↓${deck[2].down}, ←${deck[2].left})
• ${deck[3].name} (${"☆".repeat(deck[3].star)}, ${deck[3].type},  ↑${deck[3].up}, →${deck[3].right}, ↓${deck[3].down}, ←${deck[3].left})
• ${deck[4].name} (${"☆".repeat(deck[4].star)}, ${deck[4].type},  ↑${deck[4].up}, →${deck[4].right}, ↓${deck[4].down}, ←${deck[4].left})`;

  message.channel.send(text);
  return;
}

/**
 *
 * Main code
 *
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
    args = message.content.substring(3).split(` `); // Gets the command's parameters

    switch(args[0]) {
      case `ping`: // If the message is "ping"...
        message.channel.send(`pong`); // sends "pong" to the same channel
        break;
      case `startmatch`:
        if (args.length == 1) { // If no opponent name was given
          message.channel.send(`Opponent name missing.`);
        }
        else {
          if (Opponents.hasOwnProperty(args[1])) { // If an opponent name was given, and it exists in the db
            message.channel.send(`Match against opponent ${args[1]} starting!`);
            createDeck(message, args[1]);
          }
          else { // If it doesn't exist in the db
            message.channel.send(`This opponent does not exist in the database.`);
          }
        }
        break;
      case `board`:
        drawBoard(message);
        break;
    }

  }
});

// Log the bot in using the token from https://discordapp.com/developers/applications/me
client.login(Auth.token);
