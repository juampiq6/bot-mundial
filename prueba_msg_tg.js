const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID ?? '-631225392';


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TOKEN, { polling: false });

bot.sendMessage('-631225392', 'Mensaje de prueba del bot')

