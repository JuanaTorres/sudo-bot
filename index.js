// Require the Eris library
const Eris = require("eris");
const responses = require("./responses");
const commands = require("./commands");
const { BotIOManager } = require("./ops/interaction");

// Load env variables
require("dotenv").config();

// Creamos un nuevo "Cliente" (Bot) con Eris
const bot = Eris(`Bot ${process.env.DISCORD_TOKEN}`, {
  intents: ["guilds", "guildMembers", "guildMessages"],
  getAllUsers: true,
});
console.log("Preparando Bot...");

/*
  botIO es un objeto que simplifica el I/O
  Y le mandamos el prefijo, que en este caso es "sudo"
*/
const botIO = new BotIOManager(bot, "sudo", false);

bot.on("messageCreate", (msg) => {
  // Chequiamos que A) El mensaje no sea del Bot y B) Que esté usanandoo el prefix
  if (
    msg.author.id !== bot.user.id &&
    msg.content.match(botIO._prefixRegexBuilder(""))
  ) {
    console.log(`${msg.author.username}: ${msg.content}`); // log() pa ver los mensajes en consola

    botIO._msg = msg; // Acomodamos nuestro botIO con el mensaje entrante

    let estamos = { melos: false }; // Para frenar al bot de hacer if .. else si ya decidió qué hacer
    responses(botIO, estamos);
    if (!estamos.melos) {
      commands(botIO, estamos);
    }
  }
});

bot.on("ready", () => {
  console.log(`Mi nombre es ${bot.user.username}!`);
});

// Connect to Discord
bot.connect();
