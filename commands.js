const fetchUtils = require("./ops/fetchUtils");
const adminUtils = require("./ops/admin");

const setupCommands = (botIO, estamos) => {
  if (botIO.match("\\s(usermod)*(\\s[^\\s\\n]+)")) {
    const umodSplit = botIO._msg.content
      .trim(/\s+/)
      .replace(botIO._prefixRegexBuilder("\\susermod"), "")
      .trim(/\s+/)
      .split(/\s/);
    console.log(umodSplit);

    switch (umodSplit[0]) {
      case "-m"|| "--mute":
        adminUtils.muteMemberFromMention(botIO, umodSplit[1], (options = {}));
        break;
      case "-um":
      case "--unmute":
        break;
      case "-k":
      case "--kick":
        break;
      case "-b":
      case "--ban":
        adminUtils.banMemberFromMention(botIO, umodSplit[1], (options = {}));
        break;
      case "-ub":
      case "--unban":
        adminUtils.unbanMemberFromQuery(botIO, umodSplit[1], (options = {}));
        break;
    }

    estamos.melos = true;
    return;
  }

  if (botIO._prefixRegexBuilder("\\s(grep)*(\\s[^\\s\\n]+)")) {
    const grepRegExec = botIO
      ._prefixRegexBuilder("\\s(grep)*(\\s[^\\n]+)")
      .exec(botIO._msg.content);

    if (grepRegExec) {
      fetchUtils.fetchMembersAndList(
        botIO._bot,
        botIO._msg.guildID,
        botIO._msg.channel.id,
        grepRegExec[2].trim()
      );

      estamos.melos = true;
      return;
    }
  }

  const errorMsgs = [
    "Deje de inventar comandos",
    "¿Qué? Intente denuevo",
    "Nones, no conozco ese comando",
    "Algo escribió mal, porque ese comando no existe",
    "Sea serio, ese comando no existe",
    "Mire bien los docs, mongolo. Así no es el comando",
    "Deje de inventar, ese comando no es así",
    "Soy bot, no adivino. Escriba eso bien",
    "Fíjese bien, creo que la embarró",
    "Npi qué quiso decir",
    "¿Cómo? No le entendí nada",
    "Ese comando no existe, alucín",
    "¿Aaaaaah? ¿Cómo así?",
    "Mero visaje que ese comando existiera",
    "Escriba bien o le meto su taponazo",
    "O escribe bien o lo chuzo",
  ];

  botIO.say(
    `Capa8_Error: ${errorMsgs[Math.floor(Math.random() * errorMsgs.length)]}`
  );

  estamos.melos = true;
  return;
};

module.exports = setupCommands;
