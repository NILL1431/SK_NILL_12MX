const fs = require("fs-extra");
const moment = require("moment-timezone");
const request = require("request");

module.exports.config = {
  name: "admin",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Show Owner Info",
  commandCategory: "info",
  usages: "admin",
  cooldowns: 2
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.run = async function({ api, event }) {

  const cacheDir = __dirname + "/cache";
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  // 🔄 Loading animation message
  const loadingMsg = await api.sendMessage("⏳ Loading", event.threadID);

  let dots = ["⏳ Loading.", "⏳ Loading..", "⏳ Loading..."];
  for (let i = 0; i < 3; i++) {
    await sleep(700);
    api.editMessage(dots[i], loadingMsg.messageID);
  }

  const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

  const callback = () => {
    api.sendMessage({
      body: `┌───────────────⭓
│ 𝗢𝗪𝗡𝗘𝗥 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
├───────────────
│ 👤 𝐍𝐚𝐦𝐞 : 𝐒𝐊 𝐍𝐈𝐋𝐋
│ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫 : 𝐌𝐚𝐥𝐞
│ ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : 𝐒𝐢𝐧𝐠𝐥𝐞
│ 🎂 𝐀𝐠𝐞 : 𝟐𝟓+
│ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : 𝐈𝐬𝐥𝐚𝐦
│ 🎓 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : 𝐇𝐒𝐂 (𝟐𝟎𝟏𝟖)
│ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 𝐃𝐡𝐚𝐤𝐚
└───────────────⭓

┌───────────────⭓
│ 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦
├───────────────
│ 📘 Facebook:
│ https://www.facebook.com/share/1CksdSuLS6/
│ 💬 WhatsApp:
│ https://wa.me/01905566980
└───────────────⭓

┌───────────────⭓
│ 🕒 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗧𝗶𝗺𝗲
├───────────────
│ ${time}
└───────────────⭓`,
      attachment: fs.createReadStream(__dirname + "/cache/owner.jpg")
    }, event.threadID, () => {
      fs.unlinkSync(__dirname + "/cache/owner.jpg");
      api.unsendMessage(loadingMsg.messageID);
    });
  };

  request("https://i.imgur.com/idyXtoO.jpeg")
    .pipe(fs.createWriteStream(__dirname + "/cache/owner.jpg"))
    .on("close", callback);
};
