const { SlashCommandBuilder } = require("discord.js");

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
        .setName("Phone number")
        .setNameLocalizations({
          no: "Telefonnummer",
          "sv-SE": "Telefonnummer",
          de: "Telefonnummer",
          pl: "Numer",
          fi: "Puhelinnumero",
        })
        .setDescription("The phone number registered to your NTNUI account.")
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
    const phone_number = interaction.options.getString("Phone number");
    const member = interaction.user.id;

    function getKeyByValue(object, value) {
      return Object.keys(object).find((key) => object[key] === value);
    }

    // every eligible member must /register <phone_number>
    // this calls a function that iterates over all members,
    // find member with corresponding phone number and set their
    // ntnui_no as value to their Discord ID key.

    const apiCall = "api.ntnui.no/groups/esport/memberships/";
    const memberships = [];
    const discord_ntnui_pairs = {
      240125663619579905: 134882,
    };

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
        console.error("Error:", error);
      });
    for (i = 0; i < memberships.length; i++) {
      if (phone_number === memberships[i].phone_number) {
        discord_ntnui_pairs[guildMemberId] = memberships[i].ntnui_no;
      } else {
        bot.reply(`${argument} is not a valid phone number.`);
      }
    }

    // iterate over every membership in group 'esport'
    for (i = 0; i < memberships.length; i++) {
      // set current member to be Discord ID in accordance with their ntnui_no
      let member = getKeyByValue(discord_ntnui_pairs, i);

      if (memberships[i].has_valid_group_membership) {
        // grant current member "Member" role
        guildMember.roles.add("Member");
      } else {
        // revoke "Member" role
        guildMember.roles.remove("Member");
      }
    }

    await interaction.reply(
      `Phone number ${phone_number} has been registered!`
    );
  },
};
