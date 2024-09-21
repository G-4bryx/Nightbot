const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  customId: "closeBtn",
  userPermissions: [PermissionFlagsBits.ManageThreads],
  botPermissions: [PermissionFlagsBits.ManageThreads],

  run: async (client, interaction) => {
    try {
      const { channel } = interaction;
      await interaction.deferReply({ ephemeral: true });

      await channel.setLocked(true);

      return await interaction.editReply({
        content: `This channel has been locked.`,
      })
    } catch (error) {
      console.log(error);
    }
  },
};