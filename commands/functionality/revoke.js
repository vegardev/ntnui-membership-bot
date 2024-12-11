const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");
const { MEMBER_ROLE } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("revoke")
    .setDescription(`Revoke ${MEMBER_ROLE} role from a Discord user.`)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to revoke the role from.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setContexts(InteractionContextType.Guild),
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
      if (member.roles.cache.some((role) => role.name === MEMBER_ROLE)) {
        await member.roles.remove(role);
        return interaction.reply({
          content: `✅ Successfully revoked the ${MEMBER_ROLE} role from ${member.displayName}.`,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        return interaction.reply({
          content: `❌ ${member.displayName} had no ${MEMBER_ROLE} role to revoke.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (error) {
      return interaction.reply({
        content: `⚠️ Error: Failed to revoke role\n${error.message}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
