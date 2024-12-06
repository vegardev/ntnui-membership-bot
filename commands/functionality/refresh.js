const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { DiscordNTNUIPairs } = require("../../main.js");
const {
  fetchMemberships,
  grantRole,
  revokeRole,
} = require("../../utilities.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refresh")
    .setDescription("Manually refresh valid memberships statuses."),
  async execute(interaction) {
    const memberships = await fetchMemberships();

    // iterate over every membership in group 'esport'
    for (i = 0; i < memberships.length; i++) {
      // set current member to be Discord ID in accordance with their ntnui_no
      const member = await DiscordNTNUIPairs.findOne({
        where: { ntnui_id: memberships[i].ntnui_id },
      });
      if (memberships[i].has_valid_group_membership) {
        // grant current member "Member" role
        grantRole(member);
      } else {
        // revoke "Member" role
        revokeRole(member);
      }
    }

    await interaction.reply({
      content: "Esport memberships have been refreshed!",
      flags: MessageFlags.Ephemeral,
    });
  },
};
