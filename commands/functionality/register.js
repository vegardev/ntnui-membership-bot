const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const discord_ntnui_pairs = require("../../discord-ntnui-pairs.json");

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
    .addIntegerOption((option) =>
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
          "The phone number registered to your NTNUI account — don't include country code."
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
    const phone_number = interaction.options.getInteger("phone_number");
    const member = interaction.user;
    const discordId = interaction.user.id;

    function getKeyByValue(object, value) {
      return Object.keys(object).find((key) => object[key] === value);
    }

    // every eligible member must /register <phone_number>
    // this calls a function that iterates over all members,
    // find member with corresponding phone number and set their
    // ntnui_no as value to their Discord ID key.

    const apiCall = "https://api.ntnui.no/groups/esport/memberships/";
    let memberships = [];

    fetch(apiCall)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not connect to Sprint API.");
        }
      })
      .then((data) => {
        console.log("Data returned successfully.");
        memberships = data.json();
        return memberships;
      })
      .catch((error) => {
        console.error(error);
      });

    // new entry into json list of members
    for (i = 0; i < memberships.length; i++) {
      if (phone_number === memberships[i].phone_number) {
        discord_ntnui_pairs[discordId] = memberships[i].ntnui_no;
      } else {
        await interaction.reply({
          content: `${argument} is not a valid phone number.`,
          flag: MessageFlags.Ephemeral,
        });
      }
    }

    // iterate over every membership in group 'esport'
    for (i = 0; i < memberships.length; i++) {
      // set current member to be Discord ID in accordance with their ntnui_no
      const member = getKeyByValue(discord_ntnui_pairs, i);

      if (memberships[i].has_valid_group_membership) {
        // grant current member "Member" role
        member.role.add("1313952906453585970");
      } else {
        // revoke "Member" role
        member.role.remove("1313952906453585970");
      }
    }

    await interaction.reply({
      content: `Phone number ${phone_number} has been registered!`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
