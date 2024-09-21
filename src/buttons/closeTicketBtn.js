const {
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  customId: "closeTicketBtn",
  userPermissions: [PermissionFlagsBits.ManageThreads],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const confirmCloseTicketEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("Close Ticket")
        .setDescription("Are you sure you want to close this ticket?");

      const confirmCloseTicketEmbedBtns = new ActionRowBuilder().setComponents([
        new ButtonBuilder()
          .setCustomId("confirmCloseTicketBtn")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("cancelCloseTicketBtn")
          .setLabel("Cancel")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("feedbackTicketBtn")
          .setLabel("Give Feedback")
          .setStyle(ButtonStyle.Secondary),
      ]);

      return await interaction.editReply({
        embeds: [confirmCloseTicketEmbed],
        components: [confirmCloseTicketEmbedBtns],
      });
    } catch (error) {
      console.log(error);
    }
  },
};