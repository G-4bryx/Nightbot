const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ticketSetupSchema = require("../schemas/ticketSetupSchema");
const ticketSchema = require("../schemas/ticketSchema");

module.exports = {
  customId: "supportTicketBtn",

  run: async (client, interaction) => {
    try {
      const { channel, guild, member } = interaction;

      const ticketSetup = await ticketSetupSchema.findOne({
        guildID: guild.id,
        ticketChannelID: channel.id,
      });

      if (!ticketSetup) {
        return await interaction.editReply({
          content:
            "The ticket system has not been setup yet. Please contact an administrator to set it up.",
        });
      }

      if (ticketSetup.ticketType === "modal") {
        const ticketModal = new ModalBuilder()
          .setTitle("Ticket System")
          .setCustomId("ticketMdl")
          .setComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setLabel("Ticket Subject")
                .setCustomId("ticketSubject")
                .setPlaceholder("Enter a subject for your ticket")
                .setStyle(TextInputStyle.Short)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setLabel("Ticket Description")
                .setCustomId("ticketDescription")
                .setPlaceholder("Enter a description for your ticket")
                .setStyle(TextInputStyle.Paragraph)
            )
          );

        return interaction.showModal(ticketModal);
      } else {
        await interaction.deferReply({ ephemeral: true });

        const ticketChannel = guild.channels.cache.find(
          (ch) => ch.id === ticketSetup.ticketChannelID
        );
        const staffRole = guild.roles.cache.get(ticketSetup.staffRoleID);
        const username = member.user.globalName ?? member.user.username;

        const ticketEmbed = new EmbedBuilder()
          .setColor("DarkGreen")
          .setAuthor({
            author: username,
            iconURL: member.user.displayAvatarURL(),
          })
          .setTitle("Support Ticket")
          .setDescription(
            `Staff will be with you shortly.\nPlease expain your issue in as much detail as possible.`
          )
          .setFooter({
            text: `${guild.name} - Ticket`,
            iconURL: guild.iconURL(),
          })
          .setTimestamp();

        const ticketButtons = new ActionRowBuilder().setComponents([
          new ButtonBuilder()
            .setCustomId("closeTicketBtn")
            .setLabel("Close Ticket")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("lockTicketBtn")
            .setLabel("Lock Ticket")
            .setStyle(ButtonStyle.Success),
        ]);

        let ticket = await ticketSchema.findOne({
          guildID: guild.id,
          ticketMemberID: member.id,
          parentTicketChanelID: channel.id,
          closed: false,
        });

        const ticketCount = new ticketSchema.findOne({
          guildID: guild.id,
          ticketMemberID: member.id,
          parentTicketChanelID: channel.id,
          closed: true,
        }).count();

        if (ticket) {
          return await interaction.editReply({
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
            parentTicketChanelID: channel.id,
            ticketChannelID: thread.id,
            closed: false,
            membersAdded: [],
          });

          await ticket.save().catch((err) => console.log(err));

          return await interaction.editReply({
            content: `Your ticket has been created in ${thread}`,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};