const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Say a custom text")
    .addStringOption((option) =>
      option.setName("text").setDescription("The text to say").setRequired(true)
    )
    .toJSON(),

  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],

  run: async (client, interaction) => {
    const { options } = interaction;
    const text = options.getString("text");

    await interaction.deferReply();
    await interaction.channel.send(text);
    await interaction.deleteReply();

    console.log(`User ${interaction.user.tag} executed the "say" command with the text: ${text}`);
  }
};