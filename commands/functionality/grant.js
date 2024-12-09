const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");
const { MEMBER_ROLE } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("grant")
    .setDescription(`Grant ${MEMBER_ROLE} role to a Discord user.`)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to grant the role to.")
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
        content: `Role ${MEMBER_ROLE} not found in this server.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      if (!member.roles.cache.some((role) => role.name === MEMBER_ROLE)) {
        await member.roles.add(role);
        return interaction.reply({
          content: `Successfully granted the ${MEMBER_ROLE} role to ${member.displayName}.`,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        return interaction.reply({
          content: `${member.displayName} already has the role ${MEMBER_ROLE}.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (error) {
      return interaction.reply({
        content: `Failed to grant role: ${error.message}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
