const fetchUtils = require("./fetchUtils");
const lunr = require("lunr");
//const discord = require('discord.js');

const banMemberFromMention = async (
  botIO,
  mention,
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  await fetchUtils.updateGuildMembers(botIO._bot, botIO._msg.guildID);
  // extract id from mention and ban user with options
  // console.log("parsed ID from mention -> " + mention.replace(/\<\@|\>/gm, ""));
  botIO._bot.guilds
    .get(botIO._msg.guildID)
    .banMember(
      mention.replace(/\<\@|\>/gm, ""),
      (deleteMessageDays = options.deleteMessageDays),
      (reason = options.reason)
    );
  botIO.say(
    stutter.kobeniStutterString(
      `Banned ${
        botIO._bot.guilds
          .get(botIO._msg.guildID)
          .members.get(mention.replace(/\<\@|\>/gm, "")).username
      }!`
    )
  );
};

const unbanMemberFromQuery = async (
  botIO,
  query,
  options = { reason: "No reason provided" }
) => {
  // console.log(await botIO._bot.guilds.get(botIO._msg.guildID).getBans());

  // extract user from query and look for id
  const bannedUsers = await botIO._bot.guilds.get(botIO._msg.guildID).getBans();

  const lunrIdx = lunr(function () {
    this.ref("id");
    this.field("id");
    this.field("username");
    this.field("discriminator");

    bannedUsers.forEach(function (bu) {
      this.add(bu.user);
    }, this);
  });

  // console.log("parsed query -> " + query.replace(/\@|\<|\>/gm, ""));
  const bannedSearch = lunrIdx.search(query.replace(/\@|\<|\>/gm, ""));

  /*
  console.log("bannedSearch[0] ->");
  console.log(bannedSearch);
  console.log("id ->");
  console.log(bannedSearch[0].ref);
  console.log("User to Unban ->");
  */

  const userToUnban = bannedUsers.find(
    (u) => u.user.id === bannedSearch[0].ref
  );

  // console.log(userToUnban);

  botIO._bot.guilds
    .get(botIO._msg.guildID)
    .unbanMember(bannedSearch[0].ref, (reason = options.reasons));
  botIO.say(
    stutter.kobeniStutterString(
      `Unbanned ${`${userToUnban.user.username}#${userToUnban.user.discriminator}`}, since they were the closest match to `
    ),
    query,
    stutter.kobeniStutterString(`in the list of banned users!`)
  );
};
const muteMemberFromMention =  (
  botIO,
  mention,
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  console.log(botIO + "ads"+ mention);
  /* fetchUtils.updateGuildMembers(botIO._bot, botIO._msg.guildID);
  const statusMute = botIO._bot.guilds
    .get(botIO._msg.guildID)
    .members.get(user_id).voice.getMute;
    console.log(botIO + "ads"+ mention);
  if(statusMute){

  }
  // extract id from mention and ban user with options
  // console.log("parsed ID from mention -> " + mention.replace(/\<\@|\>/gm, ""));
  /*botIO.
  botIO._bot.guilds
    .get(botIO._msg.guildID)
    .banMember(
      mention.replace(/\<\@|\>/gm, ""),
      (deleteMessageDays = options.deleteMessageDays),
      (reason = options.reason)
    );
  botIO.say(
    stutter.kobeniStutterString(
      `Banned ${
        botIO._bot.guilds
          .get(botIO._msg.guildID)
          .members.get(mention.replace(/\<\@|\>/gm, "")).username
      }!`
    )
  );
  const user = message.mentions.users.first();
      if (!user) {
        return message.reply('Debes mencionar a un usuario válido.');
      }
  
      // Obtener el miembro correspondiente al usuario mencionado
      const member = message.guild.member(user);
      if (!member) {
        return message.reply('No se pudo encontrar al usuario en el servidor.');
      }
  
      // Verificar si el usuario ya está muteado
      if (member.voice.serverMute) {
        return message.reply('El usuario ya está muteado.');
      }
  
      // Mutea al usuario
      try {
        await member.voice.setMute(true);
        message.reply(`${user.tag} ha sido muteado exitosamente.`);
      } catch (error) {
        console.error('Error al mutear al usuario:', error);
        message.reply('Ocurrió un error al intentar mutear al usuario.');
      }*/
};
module.exports = { banMemberFromMention, unbanMemberFromQuery, muteMemberFromMention };
