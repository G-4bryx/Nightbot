const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const ticketSetupSchema = require("../schemas/ticketSetupSchema");
const ticketSchema = require("../schemas/ticketSchema");

module.exports = {
  customId: "ticketMdl",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { fields, guild, member, channel } = interaction;

      const sub = fields.getTextInputValue("ticketSubject");
      const description = fields.getTextInputValue("ticketDescription");

      await interaction.deferReply({ ephemeral: false });

      const ticketSetup = await ticketSetupSchema.findOne({
        guildID: guild.id,
        ticketChannelID: channel.id,
      });

      const ticketChannel = await guild.channels.cache.find(
        (ch) => ch.id === channel.id
      );
      const staffRole = guild.roles.cache.get(ticketSetup.staffRoleID);
      const username = member.user.globalName ?? member.user.username;

      const ticketEmbed = new EmbedBuilder()
        .setColor("DarkBlue")
        .setAuthor({ name: username, iconURL: member.displayAvatarURL() })
        .setTitle("New Ticket")
        .setDescription(`Subject: ${sub}\nDescription: ${description}`)
        .setFooter({ text: `${guild.name} - Ticket`, iconURL: guild.iconURL() })
        .setTimestamp();

      const ticketButtons = new ActionRowBuilder().setComponents([
        new ButtonBuilder()
          .setCustomId("closeTicketBtn")
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("lockTicketBtn")
          .setLabel("Lock Ticket")
          .setStyle(ButtonStyle.Success)
          .setDisabled(true),
      ]);

      let ticket = await ticketSchema.findOne({
        guildID: guild.id,
        ticketMemberID: member.id,
        parentTicketChanelID: channel.id,
        closed: false,
      });

      const tCount = await ticketSchema.findOne({
        guildID: guild.id,
        ticketMemberID: member.id,
        parentTicketChanelID: channel.id,
        closed: false,
      });

      const ticketCount = await ticketSchema.countDocuments({
        guildID: guild.id,
        ticketMemberID: member.id,
        parentTicketChanelID: channel.id,
        closed: false,
      });

      if (ticket) {
        return interaction.editReply({
          content: "You already have an open ticket.",
        });
      }

      const thread = await ticketChannel.threads.create({
        name: `${ticketCount + 1} - ${username}'s ticket`,
        type: ChannelType.PrivateThread,
      });

      await thread.send({
        content: `${staffRole} - ticket created by ${member}.`,
        embeds: [ticketEmbed],
        components: [ticketButtons],
      });

      if (!ticket) {
        ticket = await ticketSchema.create({
          guildID: guild.id,
          ticketMemberID: member.id,
          ticketChannelID: channel.id,
          parentTicketChanelID: channel.id,
          closed: false,
          membersAdded: [],
        });

        await ticket.save().catch((err) => console.log(err));
      }

      return await interaction.editReply({
        content: `Ticket has been created in ${thread}`,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
