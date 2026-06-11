const fs = require("fs-extra");
const moment = require("moment-timezone");
const request = require("request");
const os = require("os");

module.exports.config = {
  name: "admin",
  version: "2.0.0",
  hasPermission: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Show Owner Info",
  commandCategory: "info",
  usages: "admin",
  cooldowns: 2
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ✅ বট কখন চালু হয়েছে তা ট্র্যাক করতে
const botStartTime = Date.now();

function getUptime() {
  const ms = Date.now() - botStartTime;
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / 60000) % 60;
  const hr  = Math.floor(ms / 3600000) % 24;
  const day = Math.floor(ms / 86400000);
  if (day > 0) return `${day}d ${hr}h ${min}m`;
  if (hr  > 0) return `${hr}h ${min}m ${sec}s`;
  if (min > 0) return `${min}m ${sec}s`;
  return `${sec}s`;
}

function getRamUsage() {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  const total = os.totalmem() / 1024 / 1024;
  const pct = ((used / total) * 100).toFixed(1);
  return { used: used.toFixed(1), total: total.toFixed(0), pct };
}

function getCpuLoad() {
  const load = os.loadavg()[0];
  const cpus = os.cpus().length;
  const pct = Math.min((load / cpus) * 100, 100).toFixed(1);
  return pct;
}

function getRamBar(pct) {
  const filled = Math.round(pct / 10);
  const empty  = 10 - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

function getUserCount(api) {
  try {
    // threadList থেকে মোট unique user অনুমান (যদি api সাপোর্ট করে)
    return "N/A";
  } catch {
    return "N/A";
  }
}

module.exports.run = async function ({ api, event }) {
  const cacheDir = __dirname + "/cache";
  await fs.ensureDir(cacheDir);

  // ─── Loading Animation ───────────────────────────────
  const frames = [
    "⬜⬜⬜⬜⬜  0%",
    "🟦⬜⬜⬜⬜ 20%",
    "🟦🟦⬜⬜⬜ 40%",
    "🟦🟦🟦⬜⬜ 60%",
    "🟦🟦🟦🟦⬜ 80%",
    "🟦🟦🟦🟦🟦 100% ✅"
  ];

  const loadingMsg = await api.sendMessage(
    `╔══════════════════╗\n` +
    `║   ⏳ লোড হচ্ছে...   ║\n` +
    `╠══════════════════╣\n` +
    `║  ${frames[0]}  ║\n` +
    `╚══════════════════╝`,
    event.threadID
  );

  for (let i = 1; i < frames.length; i++) {
    await sleep(500);
    await api.editMessage(
      `╔══════════════════╗\n` +
      `║   ⏳ লোড হচ্ছে...   ║\n` +
      `╠══════════════════╣\n` +
      `║  ${frames[i]}  ║\n` +
      `╚══════════════════╝`,
      loadingMsg.messageID
    );
  }

  // ─── ডেটা সংগ্রহ ────────────────────────────────────
  const time   = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");
  const date   = moment().tz("Asia/Dhaka").format("dddd, DD MMMM YYYY");
  const uptime = getUptime();
  const ram    = getRamUsage();
  const cpu    = getCpuLoad();
  const ramBar = getRamBar(parseFloat(ram.pct));
  const platform = os.platform() === "linux" ? "🐧 Linux"
                 : os.platform() === "win32"  ? "🪟 Windows"
                 : "💻 " + os.platform();
  const nodeVer = process.version;

  // ─── মেসেজ তৈরি ─────────────────────────────────────
  const body =
`╔══════════════════════╗
║   👑  𝗢𝗪𝗡𝗘𝗥  𝗜𝗡𝗙𝗢   👑   ║
╚══════════════════════╝

┌──────────────────────
│ 👤  নাম       :  SK NILL
│ 🚹  লিঙ্গ      :  পুরুষ
│ ❤️  সম্পর্ক    :  সিঙ্গেল
│ 🎂  বয়স       :  ২৫+
│ 🕌  ধর্ম       :  ইসলাম
│ 🎓  শিক্ষা     :  HSC (2018)
│ 🏡  ঠিকানা    :  ঢাকা, বাংলাদেশ
└──────────────────────

┌──────────────────────
│ 🔗  𝗖𝗢𝗡𝗧𝗔𝗖𝗧  𝗟𝗜𝗡𝗞𝗦
├──────────────────────
│ 📘  Facebook :
│  https://www.facebook.com/share/1CksdSuLS6/
│ 💬  WhatsApp :
│  https://wa.me/01905566980
└──────────────────────

┌──────────────────────
│ 🤖  𝗕𝗢𝗧  𝗦𝗧𝗔𝗧𝗨𝗦
├──────────────────────
│ ⏱️  আপটাইম    :  ${uptime}
│ 🖥️  প্ল্যাটফর্ম  :  ${platform}
│ 🟢  Node.js   :  ${nodeVer}
│ 🧠  RAM ব্যবহার :  ${ram.used} MB / ${ram.total} MB
│  [${ramBar}] ${ram.pct}%
│ ⚙️  CPU লোড   :  ${cpu}%
└──────────────────────

┌──────────────────────
│ 🕒  𝗧𝗜𝗠𝗘  𝗜𝗡𝗙𝗢
├──────────────────────
│ 📅  তারিখ  :  ${date}
│ 🕐  সময়   :  ${time}
│ 🌍  টাইমজোন :  Asia/Dhaka (GMT+6)
└──────────────────────

   ✨ Powered by SK NILL Bot ✨`;

  // ─── ইমেজ ডাউনলোড ───────────────────────────────────
  const imagePath = `${cacheDir}/owner.jpg`;
  let attachment = null;

  try {
    await new Promise((resolve, reject) => {
      request("https://i.imgur.com/Z5cJ13l.jpeg")
        .on("error", reject)
        .pipe(fs.createWriteStream(imagePath))
        .on("close", resolve)
        .on("error", reject);
    });
    attachment = fs.createReadStream(imagePath);
  } catch {
    // ইমেজ না পেলেও টেক্সট পাঠাবে
  }

  // ─── মেসেজ পাঠানো ───────────────────────────────────
  await api.sendMessage(
    attachment ? { body, attachment } : { body },
    event.threadID
  );

  // ─── ক্লিনআপ ────────────────────────────────────────
  try { await fs.remove(imagePath); }   catch (_) {}
  try { await api.unsendMessage(loadingMsg.messageID); } catch (_) {}
};
