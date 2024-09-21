const {
  PermissionFlagsBits,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const mConfig = require("../messageConfig.json");

module.exports = {
  customId: "tempbanBtn",
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],

  run: async (client, interaction) => {
    try {
      const tempbanModal = new ModalBuilder()
        .setTitle("Temp Ban")
        .setCustomId("tempbanMdl")
        .addComponents(
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel("Time")
              .setCustomId("tempbanTime")
              .setPlaceholder("h for hour, d for day, m for month, y for year")
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel("Reason")
              .setCustomId("tempbanReason")
              .setPlaceholder("Reasoning to tempban this user")
              .setStyle(TextInputStyle.Paragraph)
          )
        );

      return await interaction.showModal(tempbanModal);
    } catch (error) {
      console.log(error);
    }
  },
};