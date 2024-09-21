const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ticketSetupSchema = require("../../schemas/ticketSetupSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("Setup a ticket system for your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("feedback-channel")
        .setDescription("The channel where feedback will be sent")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("ticket-channel")
        .setDescription("The channel where tickets will be created")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("staff-role")
        .setDescription("The role that will be able to see tickets")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("ticket-type")
        .setDescription("Whether tickets should be sent as a buttons or modals")
        .addChoices(
          { name: "Modal", value: "modal" },
          { name: "Button", value: "button" }
        )
        .setRequired(true)
    ),

  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],

  run: async (client, interaction) => {
    try {
      const { guild, options } = interaction;

      const staffRole = options.getRole("staff-role");
      const feedbackChannel = options.getChannel("feedback-channel");
      const ticketChannel = options.getChannel("ticket-channel");
      const ticketType = options.getString("ticket-type");

      await interaction.deferReply({ ephemeral: true });

      const buttonTicketCreateEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("Ticket System")
        .setDescription("Click the below button to create a ticket.")
        .setFooter({ text: "Support Tickets" })
        .setTimestamp();

      const modalTicketCreateEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("Ticket System")
        .setDescription("Click the below button to create a ticket.")
        .setFooter({ text: "Support Tickets" })
        .setTimestamp();

      const ticketSetupEmbed = new EmbedBuilder()
        .setColor("DarkBlue")
        .setTitle("Ticket System Setup")
        .setDescription(
          "Ticket system setup complete with the following settings:"
        )
        .addFields(
          { name: "Ticket Channel", value: `${ticketChannel}`, inline: true },
          {
            name: "Feedback Channel",
            value: `${feedbackChannel}`,
            inline: true,
          },
          { name: "Staff Role", value: `${staffRole}`, inline: true }
        )
        .setTimestamp();

      const openTicketButton = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setCustomId("supportTicketBtn")
          .setLabel("Open a Ticket")
          .setStyle(ButtonStyle.Secondary),
      ]);

      let setupTicket = await ticketSetupSchema.findOne({
        ticketChannelID: ticketChannel.id,
      });

      if (setupTicket) {
        return await interaction.editReply({
          content: "This channel is already setup as ticket channel.",
        });
      } else {
        setupTicket = new ticketSetupSchema({
          guildID: guild.id,
          ticketChannelID: ticketChannel.id,
          feedbackChannelID: feedbackChannel.id,
          staffRoleID: staffRole.id,
          ticketType: ticketType,
        });

        await setupTicket.save().catch((err) => console.log(err));
      }

      if (ticketType === "button") {
        await ticketChannel.send({
          embeds: [buttonTicketCreateEmbed],
          components: [openTicketButton],
        });
      } else {
        await ticketChannel.send({
          embeds: [modalTicketCreateEmbed],
          components: [openTicketButton],
        });
      }

      return await interaction.editReply({
        embeds: [ticketSetupEmbed],
      });
    } catch (error) {
      console.log(error);
    }
  },
};