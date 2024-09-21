const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong!")
    .setDMPermission(false)
    .toJSON(),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.Connect],

  run: async (client, interaction) => {
    // Deferisci la risposta come ephemerale
    await interaction.deferReply({ ephemeral: true });

    const apiLatency = client.ws.ping;
    const clientPing = Date.now() - interaction.createdTimestamp;

    const newEmbed = new EmbedBuilder()
      .setColor("#0000FF")
      .setTitle("Pong! 🏓")
      .addFields({
        name: "🕑 Latenza del bot",
        value: `**API:** ${apiLatency} ms\n**Client:** ${clientPing} ms`,
      })
      .setFooter({ text: "NeoGenesis" })
      .setTimestamp();

    // Modifica la risposta differita con l'embed
    await interaction.editReply({ embeds: [newEmbed] });

    setTimeout(async () => {
      await interaction.deleteReply();
    }, 10000);
  },
};
