const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const ticketSetupSchema = require("../schemas/ticketSetupSchema");
const ticketSchema = require("../schemas/ticketSchema");

module.exports = {
  customId: "confirmCloseTicketMdl",
  userPermissions: [PermissionFlagsBits.ManageThreads],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { channel, guild } = interaction;

      const closingEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Closing Ticket")
        .setDescription("Closing ticket...");

      await channel.send({ embeds: [closingEmbed] });

      await interaction.deleteReply();

      const closedEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Ticket Closed")
        .setDescription("This ticket has been closed.");

      const setupTicket = await ticketSetupSchema.findOne({
        guildID: guild.id,
        ticketChannelID: channel.id,
        closed: false,
      });

      const ticket = await ticketSchema.findOne({
        guildID: guild.id,
        ticketChannelID: channel.id,
        closed: false,
      });

      const staffRole = guild.roles.cache.find(setupTicket.staffRoleID);
      const hasRole = staffRole.members.has(ticket.ticketMemberID);
      if (!hasRole) {
        ticket.membersAdded.map(async (member) => {
          await channel.members.remove(member);
        });
        await channel.members.remove(ticket.ticketMemberID);
      }

      await ticketSchema.findOneAndUpdate(
        {
          guildID: guild.id,
          ticketChannelID: channel.id,
          closed: false,
        },
        {
          closed: true,
        }
      );

      await channel.setArchived(true);

      return await interaction.editReply({
        embeds: [closedEmbed]
      });
    } catch (error) {
      console.log(error);
    }
  },
};
