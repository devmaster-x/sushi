require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    `
    🎉 WELCOME TO TON “Meme Farm Match3”! 🔥\n
    🆓 Free to Play on Telegram and TON!\n
    🗓 Alpha: Feb 20th - March 20th\n
    🏆 How to climb the leaderboard? 😎\n
    🔹 Match & clear tiles to score big!\n
    🔹 Complete Quests & Challenges 🎯\n
    🔹 Refer friends & earn extra points! 📲\n
    🚀 Join now & start matching!`,
    Markup.inlineKeyboard([
      [Markup.button.url("🚀 Play", "https://t.me/Sushi_game_bot/sushi_cards_matching")],
      [Markup.button.url("📢 Follow on X", "https://x.com/playsushifarm")],
      [
        Markup.button.url("💬 Community", "https://discord.gg/yjnqnUJmYe"),
        Markup.button.url("📣 Announcements", "https://info.sushifarm.io/sushifarm/episode-1-sushi-pop-match-3"),
      ],
      [Markup.button.url("🌐 Website", "https://sushifarm.io")],
    ])
  );
});

// Error handling
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
});

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

bot.launch().then(() => console.log("🤖 Bot is running..."));
