const { EmbedBuilder } = require("discord.js");
const ticketSetupSchema = require("../../src/schemas/ticketSetupSchema");
const ticketSchema = require("../../src/schemas/ticketSchema");

module.exports = {
  customId: "feedbackTicketMdl",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { fields, guild, member, channel, message } = interaction;

      const feedbackMessage = fields.getTextInputValue("feetbackTicketMdl");
      const rating = fields.getIntegerInputValue("rateTicketMsg");

      await interaction.deferReply();

      if (rating < 1 || rating > 5) {
        return await interaction.editReply({
          content: `Please prove a rating between 1 and 5.`,
        });
      }

      let isNum = /^\d+$/.test(rating);
      if (!isNum) {
        return await interaction.editReply({
          content: `Please provide a valid rating.\nIt has to be a full number.`,
        });
      }

      const ticketSetup = await ticketSetupSchema.findOne({
        guildID: guild.id,
        ticketChannelID: channel.parentId
      });

      const ticket = await ticketSchema.findOne({
        guildID: guild.id,
        ticketChannelID: channel.id,
      });

      await ticket.updateOne({
        rating,
        feedback: feedbackMessage,
      });

      let stars = "";
      for (let i = 0; i < rating; i++) {
        stars += "⭐";
      }

      const allTickets = await ticketSchema.find({
        guildID: guild.id,
      });

      const allRatings = allTickets
        .map((t) => (t.rating != undefined ? t.rating : 0))
        .reduce((acc, current) => {
          return acc + current;
        }, 0);

      const ar = Math.round(allRatings / allTickets.length);

      let avgStars = "";
      for (let i = 0; i < ar; i++) {
        avgStars += "⭐";
      }

      const feedbackEmbed = new EmbedBuilder()
        .setColor("Blurplete")
        .setTitle("Ticket Feedback")
        .setDescription(
          `**Rating:** ${stars}\n**Feedback:** ${feedbackMessage}\n\n**Average rating:** ${avgStars}`
        )
        .setFooter({
          text: `${guild.name}`,
          iconURL: guild.iconURL(),
        })
        .setTimestamp();

      await guild.channel.cache.get(ticketSetup.feedbackChannelID).send({
        embeds: [feedbackEmbed],
      });

      message.components[0].components[0].data.disabled = true;

      await message.edit({
        components: [message.components[0]],
      });

      return await interaction.editReply({
        content: "Your feedback has been submitted.",
      });
    } catch (error) {
      console.log(error);
    }
  },
};