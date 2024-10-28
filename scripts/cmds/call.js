const axios = require("axios");

module.exports.config = {
  name: "call",
  version: "1.6.9",
  author: "Nazrul",
  description: "call any number ",
};

module.exports.onStart = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const number = args.join(" ").trim();

  if (!number) {
    return api.sendMessage(`Please provide a valid number.`, threadID, messageID);
  }
  try {
    const res = await axios.get(`http://5.9.12.94:15280/call?mobileNo=${number}&countryDialingCode=880`);
    const data = res.data;

    if (data?.Nember && data?.status) {
      await api.sendMessage(`Success! Number: ${data.Nember}, Status: ${data.status}`, threadID, messageID);
    } else {
      await api.sendMessage(`Failed: Unexpected response format.`, threadID, messageID);
    }
  } catch (error) {
    await api.sendMessage(`Error: ${error.message}`, threadID, messageID);
  }
};
