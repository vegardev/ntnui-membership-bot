const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");
const { Membership } = require("../../db.js");
const { fetchMemberships, fetchRole } = require("../../utilities.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refresh")
    .setDescription("Refresh and sync memberships statuses.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    const memberships = await fetchMemberships();
    const role = await fetchRole(interaction);
    const guild = interaction.guild;

    // iterate over every membership in group
    for (let i = 0; i < memberships.results.length; i++) {
      const currentRow = await Membership.findOne({
        ntnui_no: memberships.results[i].ntnui_no,
      });

      if (!currentRow) {
        continue;
      }

      const discordId = currentRow.get("discord_id");
      const registeredMember = await guild.members
        .fetch(discordId)
        .catch(() => null);

      if (!registeredMember) {
        continue;
      }

      if (memberships.results[i].has_valid_group_membership) {
        // grant current member MEMBER_ROLE
        await Membership.findOneAndUpdate(
          { discord_id: discordId },
          {
            has_valid_group_membership:
              memberships.results[i].has_valid_group_membership,
            group_expiry: memberships.results[i].group_expiry,
          }
        );
        if (!registeredMember.roles.cache.has(role.id)) {
          await registeredMember.roles.add(role);
        }
      } else {
        // revoke MEMBER_ROLE
        await Membership.findOneAndUpdate(
          { discord_id: discordId },
          {
            has_valid_group_membership:
              memberships.results[i].has_valid_group_membership,
            group_expiry: memberships.results[i].group_expiry,
          }
        );
        if (registeredMember.roles.cache.has(role.id)) {
          await registeredMember.roles.remove(role);
        }
      }
    }

    await interaction.reply({
      content: "🔃 Memberships have been refreshed!",
      flags: MessageFlags.Ephemeral,
    });
  },
};
