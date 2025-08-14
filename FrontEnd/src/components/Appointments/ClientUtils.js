// c:/Users/xroni/OneDrive/Documents/workspace/web/react/Diatrofologoi/FrontEnd/src/components/Appointments/ClientUtils.js
export const getDisplayNameForClient = (client) => {
  if (!client) {
    return "N/A";
  }
  if (typeof client.fullName === "string" && client.fullName.trim() !== "") {
    return client.fullName;
  }
  const firstName =
    typeof client.firstName === "string" ? client.firstName.trim() : "";
  const lastName =
    typeof client.lastName === "string" ? client.lastName.trim() : "";

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (lastName) {
    return lastName;
  }
  return "N/A";
};
