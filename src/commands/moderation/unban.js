const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Revoke a server ban")
    .addUserOption((o) =>
      o
        .setName("user_id")
        .setDescription("The id of the user ban you want to revoke")
        .setRequired(true)
    )
    .toJSON(),

  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.BanMembers],

  run: async (client, interaction) => {
    const { options, guildId, guild, member } = interaction;

    const userId = options.getUser("user_id");

    let data = await moderationSchema.findOne({ GuildID: guildId });
    if (!data) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(
          `\`❌\` This server isn't configured yet.\n\n\`💡\` Use \'/moderatesystem configure\` to start configuring this server.`
        );
    }

    if (userId === member.id) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`${mConfig.unableToInteractWithYourself}`);

      interaction.reply({ embeds: [rEmbed], ephemeral: true });
      return;
    }
    guild.members.unban(userId);

    const rEmbed = new EmbedBuilder()
      .setColor(mConfig.embedColorSuccess)
      .setFooter({ text: `${client.user.username} - Unban User` })
      .setDescription(`\`✅\` Successfully revoked the ban of \`${userId}\`.`);

    interaction.reply({ embeds: [rEmbed], ephemeral: true });
  },
};