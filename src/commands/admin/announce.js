const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Create an announcement")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription(
          "ID of the message with the content of the announcement"
        )
        .setRequired(true)
    )
    .toJSON(),

  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],

  run: async (client, interaction) => {
    const { options, channel } = interaction;
    const messageId = options.getString("id");

    await interaction.deferReply();

    try {
      const message = await channel.messages.fetch(messageId);

      await channel.send(`${message.content}`);

      await interaction.deleteReply();
      console.log(
        `User ${interaction.user.tag} fetched the message with ID: ${messageId}`
      );
    } catch (error) {
      await interaction.editReply(
        "Impossibile recuperare il messaggio. Assicurati che l'ID sia corretto e che il messaggio sia ancora presente."
      );
      console.error(`Failed to fetch message: ${error}`);
    }
  },
};