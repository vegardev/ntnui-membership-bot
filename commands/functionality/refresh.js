const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { DiscordNTNUIPairs } = require("../../main.js");
const { fetchMemberships } = require("../../utilities.js");
const { MEMBER_ROLE } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refresh")
    .setDescription("Manually refresh valid memberships statuses."),
  async execute(interaction) {
    const memberships = await fetchMemberships();
    const role = interaction.guild.roles.cache.find(
      (role) => role.name === MEMBER_ROLE
    );

    // iterate over every membership in group
    for (let i = 0; i < memberships.results.length; i++) {
      const member = await DiscordNTNUIPairs.findOne({
        where: { ntnui_no: memberships.results[i].ntnui_no },
      });
      // set current member to be Discord ID in accordance with their ntnui_no
      if (memberships.results[i].has_valid_group_membership) {
        // grant current member MEMBER_ROLE
        await member.get("discord_id").roles.add(role);
      } else {
        // revoke "Member" role
        await member.get("discord_id").roles.remove(role);
      }
    }
    await interaction.reply({
      content: "Memberships have been refreshed!",
      flags: MessageFlags.Ephemeral,
    });
  },
};
