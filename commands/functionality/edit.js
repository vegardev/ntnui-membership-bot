const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { DiscordNTNUIPairs } = require("../../main.js");
const { fetchMemberships } = require("../../utilities.js");
const { MEMBER_ROLE } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("edit")
    .setDescription(
      "Manually change a Discord account's NTNUI connected account."
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Discord account to edit.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("phone_number")
        .setDescription(
          "The new phone number to assign this Discord account — include country code (e.g. +47)."
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const memberships = await fetchMemberships();
    const member = interaction.options.getMember("target");
    let new_ntnui_no = 0;
    let grant = false;
    const role = interaction.guild.roles.cache.find(
      (role) => role.name === MEMBER_ROLE
    );

    // iterate over every membership in group
    for (let i = 0; i < memberships.results.length; i++) {
      if (phone_number !== memberships.results[i].phone_number) {
        continue;
      }
      new_ntnui_no = memberships.results[i].ntnui_no;
      grant = memberships.results[i].has_valid_group_membership ? true : false;
    }

    try {
      const affectedRows = await DiscordNTNUIPairs.update(
        {
          ntnui_no: new_ntnui_no,
        },
        { where: { discord_id: member.id } }
      );

      if (affectedRows > 0 && new_ntnui_no !== 0) {
        await interaction.reply({
          content: `✅ ${member.id} was edited, new NTNUI ID is ${new_ntnui_no}.`,
          flags: MessageFlags.Ephemeral,
        });
        if (grant) {
          member.roles.add(MEMBER_ROLE);
        } else {
          member.roles.remove(MEMBER_ROLE);
        }
      }
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return interaction.reply({
          content: `⚠️ Error: Phone number is already registered.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    return interaction.reply({
      content: `❔ Could not find a valid Discord account.`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
