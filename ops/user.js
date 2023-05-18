const changeNicknameNotSemester = async (botIO, user_id, newNick) => {
  const oldNick = botIO._bot.guilds
    .get(botIO._msg.guildID)
    .members.get(user_id).nick;
  if (!oldNick) {
    await botIO._bot.editGuildMember(botIO._msg.guildID, user_id, {
      nick: newNick + " (?)",
    });
  } else {
    await botIO._bot.editGuildMember(botIO._msg.guildID, user_id, {
      nick: oldNick.replace(/((.+)\s*)+(?=\()/, newNick + " "),
    });
  }
};

const changeSemesterNotNickname = (botIO, user_id, currNick, newSem) =>
  currNick.replace(/\s(\([\d\W]+\))/, ` (${newSem})`);

module.exports = { changeNicknameNotSemester };
