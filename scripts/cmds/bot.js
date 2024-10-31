module.exports = {
  config: {
    name: "bot",
    version: "1.0",
    author: "Nazrul", //don’t change author!
    countDown: 5,
    role: 0,
    description: "chat with bot",
    category: "what",
    guide: {
      en: "{p}{n}"
    }
  },
  onStart: async ({}) => {},
  onChat: async ({ api, event, usersData }) => {
    const data = await usersData.get(event.senderID);
    const name = data.name || "Darling";
    const messages = [
      "আমি আপনাকে কিভাবে সাহায্য করতে পারি...? 🤔",
      "আদেশ করুন বস...🙂",
      "হুম শুনছি আমি আপনি বলুন 😐",
      "আমার সব কমান্ড দেখতে.help টাইপ করুন ✅",
      "আদেশ করুন যাহাপানা 😎",
      "আবার যদি আমারে বট কইয়া ডাক দেছ তাইলে তোর বিয়ে হবে না 🫤😏",      
      "তুই বট তোর নানি বট 😤 তোর কত বড় সাহস তুই আমারে বট কস 😤",
      "আপনার কি চরিত্রে সমস্যা যে এতো বার আমাকে ডাকতেছেন 🤨",
      "ডাকছোত কেন ফাস্ট কো 😒",
      "তুমি কি আমাকে ডেকেছো...? 😇"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const nl = event.body.toLowerCase();

    if (
      nl.startsWith("bott") ||
      nl.startsWith("bot") ||
      nl.startsWith("রোবট") ||
      nl.startsWith("বট") ||
      nl.startsWith("robot")
    ) {
      const response = {
        body: `‎‎╭────────────❍\n╰➤ 👤 𝐃𝐞𝐚𝐫 『${name}』,  \n╰➤ 🗣️${randomMessage}\n╰─────────────────➤`
      };
      return api.sendMessage(response, event.threadID, event.messageID);
    }
  }
};
