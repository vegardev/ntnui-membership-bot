const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refresh")
    .setDescription("Manually refresh valid memberships statuses."),
  async execute(interaction) {
    await interaction.reply({
      content: "Esport memberships have been refreshed!",
      flag: MessageFlags.Ephemeral,
    });
  },
};
