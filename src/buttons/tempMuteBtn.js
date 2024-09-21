const {
  PermissionFlagsBits,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const mConfig = require("../messageConfig.json");

module.exports = {
  customId: "tempmuteBtn",
  userPermissions: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],

  run: async (client, interaction) => {
    try {
      const tempmuteModal = new ModalBuilder()
        .setTitle("Temp Mute")
        .setCustomId("tempmuteMdl")
        .addComponents(
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel("Time")
              .setCustomId("tempmuteTime")
              .setPlaceholder("h for hour, d for day, m for month, y for year")
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel("Reason")
              .setCustomId("tempmuteReason")
              .setPlaceholder("Reasoning to tempmute this user")
              .setStyle(TextInputStyle.Paragraph)
          )
        );

      return await interaction.showModal(tempmuteModal);
    } catch (error) {
      console.log(error);
    }
  },
};