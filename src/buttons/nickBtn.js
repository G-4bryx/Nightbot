const moderationSchema = require("../schemas/moderation");
const mConfig = require("../messageConfig.json");
const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  customId: "nickBtn",
  userPermissions: [PermissionFlagsBits.ManageNicknames],
  botPermissions: [PermissionFlagsBits.ManageNicknames],

  run: async (client, interaction) => {
    const { message, channel, guildId, guild, user } = interaction;

    const embedAuthor = message.embeds[0].author;
    const tMember = await guild.members.fetch({
      query: embedAuthor.name,
      limit: 1,
    });

    const targetMember = tMember.first();

    const tagline = Math.floor(Math.random() * 1000) + 1;

    const rEmbed = new EmbedBuilder()
      .setColor("#FFFFFF")
      .setFooter({ text: `${client.user.username} - Moderate User` })
      .setAuthor({
        name: `${targetMember.user.username}`,
        iconURL: targetMember.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `\`❔\` What is the reason to moderate the nickname of ${targetMember.user.username}?
         \`❕\` You have 15 seconds to reply. After this time the moderation action will be automatically cancelled.
         \`💡\` To continue without reason, answer with \`-\`
         \`💡\` To cancel the moderation action, answer with \`cancel\``
      );

    message.edit({ embeds: [rEmbed], components: [] });

    const filter = (m) => m.author.id === user.id;
    const reasonCollector = await channel
      .awaitMessages({ filter, max: 1, time: 15_000, errors: ["time"] })
      .then((reason) => {
        if (reason.first().content.toLowerCase() === "cancel") {
          reason.first().delete();

          rEmbed
            .setColor(mConfig.embedColorError)
            .setDescription(`\`❌\` Moderation action cancelled.`);

          message.edit({ embeds: [rEmbed] });
          setTimeout(() => {
            message.delete();
          }, 2_000);
          return;
        }
        return reason;
      })
      .catch(() => {
        reason.first().delete();

        rEmbed
          .setColor(mConfig.embedColorError)
          .setDescription(`\`❌\` Moderation action expired.`);

        message.edit({ embeds: [rEmbed] });
        setTimeout(() => {
          message.delete();
        }, 2_000);
        return;
      });

    const reasonObj = reasonCollector?.first();

    if (!reasonObj) return;

    let reason = reasonObj.content;

    if (reasonObj.content === "-") reason = "No reason specified.";

    let dataGD = await moderationSchema.findOne({ GuildID: guildId });
    if (!dataGD) return;

    await targetMember.setNickname(` Moderated Nickname ${tagline}`);

    const { LogChannelID } = dataGD;
    const loggingChannel = guild.channels.cache.get(LogChannelID);

    const lEmbed = new EmbedBuilder()
      .setColor("white")
      .setTitle("`⛔` User nickname moderated")
      .setAuthor({
        name: `${targetMember.user.username}`,
        iconURL: targetMember.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `\`💡\` I moderated the users nickname to - Moderate Nickname ${tagline} \`💡\``
      )
      .addFields(
        { name: "Changed by", value: `<@${user.id}>`, inline: true },
        { name: "Reason", value: `${reason}`, inline: true }
      )
      .setFooter({
        iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
        text: `${client.user.username} - Logging System`,
      });

    loggingChannel.send({ embeds: [lEmbed] });

    rEmbed
      .setColor(mConfig.embedColorSuccess)
      .setDescription(
        `\`✅\` Successfully moderated the users name to ${targetMember.user.username}.`
      );

    message.edit({ embeds: [rEmbed] });
    setTimeout(() => {
      message.delete();
    }, 2_000);
  },
};
