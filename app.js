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

// OpenAI's GPT-3 (Generative Pre-trained Transformer 3) is a language model that uses deep learning to produce human-like text.
// Text-davici-003 is an open-source natural language processing (NLP) model developed by OpenAI. 
// It is a transformer-based language model that was trained on a large corpus of text from the web. 
// It is designed to generate human-like text, and can be used for a variety of tasks such as text summarization, 
// question answering, and text generation.
bot.onText(/\/m (.+)/, async (msg, match) => {
	const resp = match[1];
	const completion = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: resp,
		max_tokens: 700,
		temperature: 0,
		top_p: 0.5,
		frequency_penalty: 0.3,
		presence_penalty: 0.15
		});

	const dataReply = completion.data.choices[0].text + '\n \n **[Join ChatGPT Community](https://t.me/+FmApN6hcCtFmZTdl)**'

	await bot.sendMessage(msg.chat.id, dataReply)
});

// Listen for any kind of message. There are different kinds of messages.
bot.startPolling();
