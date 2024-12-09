const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { DiscordNTNUIPairs } = require("../../main.js");
const { fetchMemberships } = require("../../utilities.js");
const { MEMBER_ROLE } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setNameLocalizations({
      no: "registrer",
      "sv-SE": "registrera",
      de: "registrieren",
      pl: "rejestrować",
      fi: "rekisteröidy",
    })
    .setDescription("Register your NTNUI account to your Discord account.")
    .setDescriptionLocalizations({
      no: "Registrer din NTNUI-konto til Discord-kontoen din.",
      "sv-SE": "Registrera ditt NTNUI-konto på ditt Discord-konto.",
      de: "Registrieren Sie Ihr NTNUI-Konto bei Ihrem Discord-Konto.",
      pl: "Zarejestruj swoje konto NTNUI na swoim koncie Discord.",
      fi: "Rekisteröi NTNUI-tilisi Discord-tilillesi.",
    })
    .addStringOption((option) =>
      option
        .setName("phone_number")
        .setNameLocalizations({
          no: "telefonnummer",
          "sv-SE": "telefonnummer",
          de: "telefonnummer",
          pl: "numer",
          fi: "puhelinnumero",
        })
        .setDescription(
          "The phone number registered to your NTNUI account — include country code (e.g. +47)."
        )
        .setDescriptionLocalizations({
          no: "Telefonnummeret som er registrert til din NTNUI-konto.",
          "sv-SE": "Telefonnumret som är registrerat på ditt NTNUI-konto.",
          de: "Die Telefonnummer, die in Ihrem NTNUI-Konto registriert ist.",
          pl: "Numer telefonu zarejestrowany na Twoim koncie NTNUI.",
          fi: "NTNUI-tiliisi rekisteröity puhelinnumero.",
        })
        .setRequired(true)
    ),
  async execute(interaction) {
    const phone_number = interaction.options.getString("phone_number");
    const discordId = interaction.member.id;
    const role = interaction.guild.roles.cache.find(
      (role) => role.name === MEMBER_ROLE
    );
    // every eligible member must /register <phone_number>
    // this calls a function that iterates over all members,
    // find member with corresponding phone number and set their
    // ntnui_no as value to their Discord ID key.

    const memberships = await fetchMemberships();

    // new entry into SQLite database
    for (i = 0; i < memberships.results.length; i++) {
      if (phone_number !== memberships.results[i].phone_number) {
        continue;
      }

      try {
        const new_pair = await DiscordNTNUIPairs.create({
          discord_id: discordId,
          ntnui_no: memberships.results[i].ntnui_no,
          has_valid_group_membership:
            memberships.results[i].has_valid_group_membership,
          group_expiry: memberships.results[i].group_expiry,
        });

        if (role && new_pair.get("has_valid_group_membership")) {
          await interaction.member.roles.add(role);
        }
        return interaction.reply({
          content: `Your Discord account has successfully been linked to NTNUI user ${new_pair.ntnui_no}.`,
          flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        console.log(error);
        if (error.name === "SequelizeUniqueConstraintError") {
          return interaction.reply({
            content: `Either Discord ID or phone number is already registered.`,
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    }

    return interaction.reply({
      content: `${phone_number} is not a valid phone number.`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
