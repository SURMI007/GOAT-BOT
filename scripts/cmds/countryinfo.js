const axios = require('axios');

module.exports = {
  config: {
    name:"countryinfo",
    aliases: ["countryinfo"],
    version: "1.0",
		category: "info",
    author: "Lahatra"
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(' ');

    if (!query) {
      return api.sendMessage("Donne-moi une question!", event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(`https://restcountries.com/v3/name/${query}`);

      if (response.data) {
        const country = response.data[0];
        let message = '';

        message += `╭•┄┅════❁🌺❁════┅┄•╮\n•—»✨𝐂𝐎𝐔𝐍𝐓𝐑𝐘-𝐈𝐍𝐅𝐎✨«—•\n╰•┄┅════❁🌺❁════┅┄•╯\n\n╭─────────────❍\n╰‣[🌍]𝐂𝐎𝐔𝐍𝐓𝐑𝐘 𝐍𝐀𝐌𝐄: ${country.name.common}
╭─────────────❍\n╰‣[🔰]𝐂𝐀𝐏𝐈𝐓𝐀𝐋: ${country.capital}
╭─────────────❍\n╰‣[👥]𝐏𝐎𝐏𝐔𝐋𝐀𝐓𝐈𝐎𝐍: ${country.population}
╭─────────────❍\n╰‣[🌐]𝐋𝐀𝐍𝐆𝐔𝐀𝐆𝐄:  ${Object.values(country.languages).join(', ')}
`;

        await api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage("J'ai pas trouvé de pays correspondant à ta recherche!", event.threadID, event.messageID);
      }
    } catch (error) {
      api.sendMessage("J'ai rencontré une erreur en récupérant les informations sur le pays!", event.threadID, event.messageID);
    }
  }
};
