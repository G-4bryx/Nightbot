const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Deletes a specific number of messages provided")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of messages to delete")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription(
          "Messages to be deleted from a specific user in a channel"
        )
    )
    .toJSON(),

  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  run: async (client, interaction) => {
    const { options, channel } = interaction;
    const targetUser = options.getUser("target");
    let amount = options.getInteger("amount");
    const multiMsg = amount === 1 ? "messages" : "messages";

    if (!amount || amount > 100 || amount < 1) {
      const rEmbed = new EmbedBuilder()
        .setColor(mConfig.embedColorError)
        .setDescription(
          "`❌` Please specify an amount between 1 and 100 before deleting the messages."
        );

      return await interaction.reply({ embeds: rEmbed, ephemeral: true });
    }

    try {
      const channelMessages = await channel.messages.fetch();

      if (channelMessages.size === 0) {
        const rEmbed = new EmbedBuilder()
          .setColor(mConfig.embedColorError)
          .setDescription("`❌` No messages in this channel to delete.");

        return await interaction.reply({ embeds: rEmbed, ephemeral: true });
      }

      if (amount > channelMessages.size) amount = channelMessages.size;

      const clearEmbed = new EmbedBuilder().setColor(mConfig.embedColorSuccess);

      let messagesToDelete = [];

      if (target) {
        let i = 0;
        channelMessages.forEach((m) => {
          if (m.author.id === target.id && messagesToDelete.length < amount) {
            messagesToDelete.push(m);
            i++;
          }
        });

        clearEmbed.setDescription(
          `\`✅\` Successfully cleared ${messagesToDelete.length} ${multiMsg} from ${target} in ${channel}`
        );
      } else {
        messagesToDelete = channelMessages.first(amount);
        clearEmbed.setDescription(
          `\`✅\` Successfully cleared ${messagesToDelete.length} ${multiMsg} from ${target} in ${channel}`
        );
      }

      if (messagesToDelete.length > 0) {
        await channel.bulkDelete(messagesToDelete);
      }

      await interaction.editReply({ embeds: [clearEmbed] });
    } catch (error) {
        rEmbed.setDescription(`\`❌\` An error occurred while deleting messages. Please try again later.`);
        await interaction.followUp({ embeds: [rEmbed], ephemeral: true });
    }
  },
};
