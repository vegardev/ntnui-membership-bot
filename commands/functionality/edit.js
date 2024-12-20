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
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    const memberships = await fetchMemberships();
    const role = await fetchRole(interaction);
    const member = interaction.options.getMember("target");
    const phone_number = interaction.options.getString("phone_number");
    let new_ntnui_no = 0;
    let new_group_expiry = "";
    let grant = false;
    const phone_regex = /^\+\d+$/;
    const registered = await Membership.findOne({
      discord_id: member.id,
    });

    if (!registered) {
      return interaction.reply({
        content: `❔ Could not find a registered Discord account.\n\n📝 Make sure they are registered!`,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!phone_number.match(phone_regex)) {
      return interaction.reply({
        content: `❌ Please use a phone number with its country code (for example +47).`,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!role) {
      return interaction.reply({
        content: "⚠️ Error: Could not find the required role.",
        ephemeral: true,
      });
    }

    // iterate over every membership in group
    for (let i = 0; i < memberships.results.length; i++) {
      if (phone_number !== memberships.results[i].phone_number) {
        continue;
      }
      new_ntnui_no = memberships.results[i].ntnui_no;
      new_ntnui_contract_expiry_date =
        memberships.results[i].ntnui_contract_expiry_date;
      grant = memberships.results[i].has_valid_group_membership;
    }

    try {
      const affectedRows = await Membership.findOneAndUpdate(
        { discord_id: member.id },
        {
          ntnui_no: new_ntnui_no,
          has_valid_group_membership: grant,
          ntnui_contract_expiry_date: new_ntnui_contract_expiry_date,
        }
      );

      if (affectedRows > 0 && new_ntnui_no !== 0) {
        if (grant) {
          member.roles.add(role);
        } else {
          member.roles.remove(role);
        }
        return interaction.reply({
          content: `✅ ${member.displayName} was edited, their new NTNUI ID is ${new_ntnui_no}.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return interaction.reply({
          content: `⚠️ Error: Phone number is already registered.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
