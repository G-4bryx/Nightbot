const {
  PermissionFlagsBits,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const mConfig = require("../messageConfig.json");

module.exports = {
  customId: "addroleBtn",
  userPermissions: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],

  run: async (client, interaction) => {
    try {
      const addroleBtn = new ModalBuilder()
        .setTitle("User Add Role")
        .setCustomId("addroleMdl")
        .addComponents(
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel("Role ID")
              .setCustomId("role_id_input")
              .setPlaceholder("Example: 789123456789012345")
              .setStyle(TextInputStyle.Short)
          )
        );

      return await interaction.showModal(addroleBtn);
    } catch (error) {
      console.log(error);
    }
  },
};