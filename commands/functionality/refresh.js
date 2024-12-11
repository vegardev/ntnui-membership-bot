const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");
const { DiscordNTNUIPairs } = require("../../database.js");
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
      const currentRow = await DiscordNTNUIPairs.findOne({
        where: { ntnui_no: memberships.results[i].ntnui_no },
      });

      if (!currentRow) {
        continue;
      }

      // set current member to be Member object in accordance with their ntnui_no
      const registeredMember = guild.members.fetch(
        currentRow.get("discord_id")
      );

      if (
        memberships.results[i].has_valid_group_membership &&
        registeredMember
      ) {
        // grant current member MEMBER_ROLE
        await DiscordNTNUIPairs.update(
          {
            has_valid_group_membership:
              memberships.results[i].has_valid_group_membership,
            group_expiry: memberships.results[i].group_expiry,
          },
          { where: { discord_id: registeredMember.id } }
        );
        await registeredMember.roles.add(role);
      } else {
        // revoke MEMBER_ROLE
        await DiscordNTNUIPairs.update(
          {
            has_valid_group_membership:
              memberships.results[i].has_valid_group_membership,
            group_expiry: memberships.results[i].group_expiry,
          },
          { where: { discord_id: registeredMember.id } }
        );
        await registeredMember.roles.remove(role);
      }
    }

    await interaction.reply({
      content: "🔃 Memberships have been refreshed!",
      flags: MessageFlags.Ephemeral,
    });
  },
};
