const setupResponses = (botIO, estamos) => {
  // Listen for the messageCreate event

  // Check if the message content is "ping"
  if (botIO.match("\\s+ping")) {
    // Send a reply with the bot's pong response
    botIO.say("Pong! Latency is...", Date.now() - botIO._msg.timestamp, "ms");
    estamos.melos = true;
    return;
  }

  if (botIO.match("\\s+[Hh]([eE][lL][lL][oO]|[eE][yY]|[iI])!*")) {
    // Greet the user like Kobeni from Chainsaw Man would
    const greetings = [
      `Hello, ${botIO._msg.author.username}`,
      `Hello, ${botIO._msg.author.username}...`,
      `Um.. hi...`,
      `Ah... hi there, ${botIO._msg.author.username}!`,
      `Hi there, ${botIO._msg.author.username}!`,
      `Hiya!`,
      `Heya...!`,
      `Sup!`,
      `Sup, ${botIO._msg.author.username}!`,
      `Hi!`,
      `Yo!`,
      `Hey there!`,
      `So glad to see you, ${botIO._msg.author.username}!`,
      `Always happy to see a friendly face!`,
      `How's it going?`,
      `How's it going, ${botIO._msg.author.username}?`,
      `How's it going...?`,
    ];

    botIO.say(greetings[Math.floor(Math.random() * greetings.length)]);
    estamos.melos = true;
    return;
  }
};

module.exports = setupResponses;
