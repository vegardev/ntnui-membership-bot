const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");
const { DiscordNTNUIPairs } = require("../../main.js");
const { grantRole, revokeRole } = require("../../utilities.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("edit")
    .setDescription("Grant or revoke role from user.")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Action to take. (grant/revoke)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("discord_account")
        .setDescription("Discord account to grant 'Member' role.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    const action = interaction.options.getString("action");
    const discord_user = interaction.options.getInteger("discord_user");

    try {
      const member = await interaction.guild.members.fetch(discord_user);
      if (!member) {
        return interaction.reply({
          content: "Member not found",
          flags: MessageFlags.Ephemeral,
        });
      }

      if (action === "grant") {
        await grantRole(member);
      } else if (action === "revoke") {
        await revokeRole(member);
      } else {
        return interaction.reply({
          content: "Invalid action. Use 'grant' or 'revoke'.",
          flags: MessageFlags.Ephemeral,
        });
      }

      return interaction.reply({
        content: `Role ${action}ed successfully.`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      return interaction.reply({
        content: `Error: ${error.message}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
