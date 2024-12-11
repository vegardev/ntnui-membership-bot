const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { DiscordNTNUIPairs } = require("../../main.js");
const { MEMBER_ROLE } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unregister")
    .setDescription("Unregister a Discord account from an NTNUI account.")
    .addUserOption((target) =>
      target
        .setName("target")
        .setDescription("Discord account to unregister.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("target");
    const role = interaction.guild.roles.cache.find(
      (role) => role.name === MEMBER_ROLE
    );

    if (!role) {
      return interaction.reply({
        content: `❔ Role ${MEMBER_ROLE} not found in this server.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      const affectedRow = await DiscordNTNUIPairs.destroy({
        where: { discord_id: member.id },
      });

      if (!affectedRow) {
        return interaction.reply({
          content: `❌ Discord user is not registered.`,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await member.roles.remove(role);
        return interaction.reply({
          content: `✅ ${member.displayName} has been unregistered.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (error) {
      interaction.reply({
        content: `⚠️ Error:\n${error.message}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
