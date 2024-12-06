const MEMBER_ROLE_ID = "1313952906453585970";

async function fetchMemberships() {
  const apiCall = "https://api.ntnui.no/groups/esport/memberships/";
  let memberships = [];

  try {
    const response = await fetch(apiCall);
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

async function grantRole(member) {
  await member.roles.add(MEMBER_ROLE_ID);
}

async function revokeRole(member) {
  await member.roles.remove(MEMBER_ROLE_ID);
}

module.exports = { fetchMemberships, grantRole, revokeRole };
