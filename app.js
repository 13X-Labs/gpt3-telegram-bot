const TelegramBot = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

// 13XLabs: We are proud to announce the launch of our ChatGpt Telegram Bot using Nodejs.
// replace the value below with the Telegram token you receive from @BotFather
const bot = new TelegramBot(process.env.BOT_TOKEN);

// OpenAI API
const configuration  = new Configuration({
	organization: process.env.OPENAI_ORG,
	apiKey: process.env.OPENAI_API,
  });

const openai = new OpenAIApi(configuration);

// Matches "/echo [whatever]"
bot.onText(/\/m (.+)/, async (msg, match) => {
	const resp = match[1];
	const completion = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: resp,
		max_tokens: 1000,
		temperature: 0,
		});

	await bot.sendMessage(msg.chat.id, completion.data.choices[0].text)
});

// Listen for any kind of message. There are different kinds of messages.
bot.startPolling();
