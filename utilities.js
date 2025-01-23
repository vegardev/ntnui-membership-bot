const { API, API_LINK, MEMBER_ROLE, guildId } = require("./config.json");

async function fetchMemberships() {
  const apiCall = API_LINK;
  let memberships = [];

  try {
    const response = await fetch(apiCall, {
      headers: {
        accept: "application/json",
        "API-KEY": API,
      },
    });
    if (!response.ok) {
      throw new Error("Could not connect to Sprint API.");
    }
    memberships = await response.json();
    console.log("Data returned successfully.");
  } catch (error) {
    console.error(error);
  }

  return memberships;
}
async function fetchRole(client) {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    throw new Error("Guild not found,");
  }

  const role = guild.roles.cache.find((role) => role.name === MEMBER_ROLE);

  return role;
}

module.exports = { fetchMemberships, fetchRole };
