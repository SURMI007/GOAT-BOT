const axios = require('axios');

module.exports = {
  config: {
    name: "bot",
    version: "1.0.0",
    role: 0,
    description: "talk with bot",
    category: "talk",
    guide: "hi",
    coolDown: 5,
  },

  onReply: async function ({ api, event, onReply }) {
    try {
      const response = await axios.get(`http://37.27.114.136:25472/sim?type=ask&ask=${encodeURIComponent(event.body)}`);
      console.log(response.data);
      const result = response.data.data.msg;

      api.sendMessage(result, event.threadID, (error, info) => {
        if (error) {
          console.error('Error replying to user:', error);
          return api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
        }
        global.GoatBot.onReply.set({
          type: 'reply',
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          head: event.body
        });
      }, event.messageID);

    } catch (error) {
      console.error('Error in onReply:', error);
      api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
    }
  },

  onStart: async function ({ api, event, args, Users, permission, onReply }) {
    try {
      const msg = args.join(" ");
      const userPermission = event.senderID && (await Users.getData(event.senderID)).permission;
      const admin = global.GoatBot.config.adminBot;
      const apiData = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN/Nayan/main/api.json');
      const apiUrl = apiData.data.sim;

      if (!msg) {
        const tl = [
          "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
          "কি গো সোনা আমাকে ডাকছ কেনো",
          "বার বার আমাকে ডাকস কেন😡",
          "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱",
          "হুম জান তোমার অইখানে উম্মমাহ😷😘",
          "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
          "আমাকে এতো না ডেকে বস নয়নকে একটা গফ দে 🙄",
          "jang hanga korba",
          "jang bal falaba🙂"
        ];
        const name = await Users.getNameUser(event.senderID);
        const rand = tl[Math.floor(Math.random() * tl.length)];
        return api.sendMessage({ 
          body: `╭────────────❍\n╰➤ 👤 𝐃𝐞𝐚𝐫 『${name}』,\n╰➤ 🗣️ ${rand}\n╰─────────────────➤`, 
          mentions: [{ tag: name, id: event.senderID }] 
        }, event.threadID, (error, info) => {
          if (error) {
            return api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
          }

          global.GoatBot.onReply.set({
            type: 'reply',
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            head: msg,
          });
        }, event.messageID);
      } 

      else if (msg.startsWith("delete")) {
        if (!admin.includes(event.senderID.toString())) {
          return api.sendMessage('You do not have permission to use this command.', event.threadID, event.messageID);
        }

        const deleteParams = msg.replace("delete", "").trim().split("&");
        const question = deleteParams[0].replace("ask=", "").trim();
        const answer = deleteParams[1].replace("ans=", "").trim();

        const response = await axios.get(`${apiUrl}/sim?type=delete&ask=${encodeURIComponent(question)}&ans=${encodeURIComponent(answer)}`);
        const replyMessage = response.data.msg || response.data.data.msg;

        return api.sendMessage({ body: replyMessage }, event.threadID, event.messageID);
      }

      else if (msg.startsWith("info")) {
        const response = await axios.get(`${apiUrl}/sim?type=info`);
        const totalAsk = response.data.data.totalKeys;
        const totalAns = response.data.data.totalResponses;

        return api.sendMessage({ body: `Total Ask: ${totalAsk}\nTotal Answer: ${totalAns}` }, event.threadID, event.messageID);
      } 

      else if (msg.startsWith("teach")) {
        const teachParams = msg.replace("teach", "").trim().split("&");
        const question = teachParams[0].replace("ask=", "").trim();
        const answer = teachParams[1].replace("ans=", "").trim();

        const response = await axios.get(`${apiUrl}/sim?type=teach&ask=${encodeURIComponent(question)}&ans=${encodeURIComponent(answer)}`);
        const replyMessage = response.data.msg;
        const ask = response.data.data.ask;
        const ans = response.data.data.ans;
        
        if (replyMessage.includes("already")) {
          return api.sendMessage(`📝Your Data Already Added To Database\n1️⃣ASK: ${ask}\n2️⃣ANS: ${ans}`, event.threadID, event.messageID);
        }

        return api.sendMessage({ body: `📝Your Data Added To Database Successfully\n1️⃣ASK: ${ask}\n2️⃣ANS: ${ans}` }, event.threadID, event.messageID);
      }

      else if (msg.startsWith("askinfo")) {
        const question = msg.replace("askinfo", "").trim();

        if (!question) {
          return api.sendMessage('Please provide a question to get information about.', event.threadID, event.messageID);
        }

        const response = await axios.get(`${apiUrl}/sim?type=keyinfo&ask=${encodeURIComponent(question)}`);
        const replyData = response.data.data;
        const answers = replyData.answers;

        if (!answers || answers.length === 0) {
          return api.sendMessage(`No information available for the question: "${question}"`, event.threadID, event.messageID);
        }

        const replyMessage = `Info for "${question}":\n\n` +
          answers.map((answer, index) => `📌 ${index + 1}. ${answer}`).join("\n") +
          `\n\nTotal answers: ${answers.length}`;

        return api.sendMessage({ body: replyMessage }, event.threadID, event.messageID);
      }

      else if (msg.startsWith("help")) {
        const cmd = this.config.name;
        const prefix = global.GoatBot.config.prefix;
        const helpMessage = `
        🌟 **Available Commands:**

        1. 🤖 ${prefix}${cmd} askinfo [question]: Get information about a specific question.

        2. 📚 ${prefix}${cmd} teach ask=[question]&ans=[answer]: Teach the bot a new question and answer pair.

        3. ❌ ${prefix}${cmd} delete ask=[question]&ans=[answer]: Delete a specific question and answer pair. (Admin only)

        4. 📊 ${prefix}${cmd} info: Get the total number of questions and answers.

        5. 👋 ${prefix}${cmd} hi: Send a random greeting.

        ⚡ Use these commands to interact with the bot effectively!
        `;

        return api.sendMessage({ body: helpMessage }, event.threadID, event.messageID);
      }

      else {
        const response = await axios.get(`${apiUrl}/sim?type=ask&ask=${encodeURIComponent(msg)}`);
        const replyMessage = response.data.data.msg;

        api.sendMessage({ body: replyMessage }, event.threadID, (error, info) => {
          if (error) {
            return api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
          }

          global.GoatBot.onReply.set({
            type: 'reply',
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            head: msg,
          });
        }, event.messageID);
      }
    } catch (error) {
      console.log(error);
      api.sendMessage('An error has occurred, please try again later.', event.threadID, event.messageID);
    }
  }
};
