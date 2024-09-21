const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const mConfig = require("../../messageConfig.json");
const eConfig = require("../../embedConfig.json");

module.exports = {
    data: new SlashCommandBuilder()
       .setName("embed")
       .setDescription("Send custom embed")
       .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
       .addChannelOption((option) => option.setName("channel").setDescription("Channel to send embed").setRequired(true)),

    run: async (client, interaction) => {
        const { channel } = interaction;

        const customOneEmbed = new EmbedBuilder()
        .setColor(eConfig.one.embedColor)
        .setTitle(eConfig.one.embedTitle)
        .setDescription(eConfig.one.embedDescription)
        .setFooter(eConfig.one.embedFooter)

        const customTwoEmbed = new EmbedBuilder()

        await channel.send({ embeds: [customOneEmbed] });
        await channel.send({ embeds: [customTwoEmbed] });
        const rEmbed = new EmbedBuilder()
        .setColor(mConfig.embedColorSuccess)
        .setDescription(`\`✅\` Successfully sent an embed in ${channel}`)
       .setColor(mConfig.embedColorSuccess)
    }
}