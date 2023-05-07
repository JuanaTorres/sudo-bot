const updateGuildMembers = async (bot, guildID) => {
  bot.guilds.get(guildID).fetchAllMembers();
};

const fetchMembersAndList = (bot, guildID, channelID, query) => {
  bot.guilds
    .get(guildID)
    .fetchMembers((options = { query: query }))
    .then((result) => {
      return result.map((r) => r.mention).map((m, i) => `${i + 1}: ${m}`);
    })
    .then((resultStrings) => {
      if (resultStrings.length > 0) {
        bot.createMessage(
          channelID,
          "Here are the top results for '" +
            query +
            "', " +
            msg.author.mention +
            "\n" +
            resultStrings.join("\n")
        );
        estamos.melos = true;
        return;
      } else {
        bot.createMessage(
          channelID,
          `Sorry, I couldn't find any users with a name like that`
        );
      }
    });
};

module.exports = { fetchMembersAndList, updateGuildMembers };
