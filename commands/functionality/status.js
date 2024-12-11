const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");
const { DiscordNTNUIPairs } = require("../../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Get a Discord account's database entry details.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Discord account to get entry of.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    const member = interaction.options.getMember("target");

    const fetchedRow = await DiscordNTNUIPairs.findOne({
      where: { discord_id: member.id },
    });

    if (!fetchedRow) {
      return interaction.reply({
        content: `❔ No database entry found for ${member.displayName}.`,
        flags: MessageFlags.Ephemeral,
      });
    }
    const entryDetails = JSON.stringify(fetchedRow.dataValues, null, 2);

    interaction.reply({
      content: `🔍 Database entry of ${member.displayName}:\n\`\`\`json\n${entryDetails}\n\`\`\``,
      flags: MessageFlags.Ephemeral,
    });
  },
};
