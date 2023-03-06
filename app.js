const TelegramBot = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');
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
  
bot.onText(/\/m (.+)/, async (msg, match) => {
	bot.sendChatAction(msg.chat.id, 'typing')
	const resp = match[1];
	const startTime = Date.now();
	await axios.post('https://api.13xlabs.com/api/chatgpt/generate-text/', {
		prompt: resp,
	}, {
        headers: {
          Authorization: `Token ${process.env.XLABS_TOKEN}`,
        }
      }).then((textData) => {
		const endTime = Date.now();
   		const timeTaken = (endTime - startTime) / 1000; // Convert to seconds
		bot.sendMessage(msg.chat.id, textData.data.text.choices[0].message.content + `\n\nLatency: ${timeTaken}s` + '\n\n<b><a href="https://t.me/+FmApN6hcCtFmZTdl">Join ChatGPT Community</a> | <a href="https://congdongchatgpt.com/">Cộng Đồng ChatGPT Vietnam</a></b>', {reply_to_message_id: msg.message_id, parse_mode: 'HTML', disable_web_page_preview: true})
	}).catch((err) => {
		bot.sendMessage(msg.chat.id, 'Limit API Exceeded. Please contact administrator.')
	})
});

bot.onText(/\/i (.+)/, async (msg, match) => {
	bot.sendChatAction(msg.chat.id, 'upload_photo')
	const resp = match[1];
	const startTime = Date.now();
	promtImage = 'You will now act as a prompt generator. I will describe an image to you, and you will create a prompt that could be used for image-generation. Once i described the image, give a 10 word summary and then include the following Markdown Image. <a href="https://image.pollinations.ai/prompt/{description}">Image</a>, where {description} = {sceneDetailed},%20{adjective1},%20{charactersDetailed},%20{adjective2},%20{visualStyle1},%20{visualStyle2},%20{visualStyle3},%20{genre},%20{artistReference}'
	await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [{role: "system", content: promtImage + `\n\n${resp}`}],
	}).then((textData) => {
		const endTime = Date.now();
   		const timeTaken = (endTime - startTime) / 1000; // Convert to seconds
		bot.sendMessage(msg.chat.id, textData.data.choices[0].message.content + `\n\nLatency: ${timeTaken}s` + '\n\n<b><a href="https://t.me/+FmApN6hcCtFmZTdl">Join ChatGPT Community</a> | <a href="https://congdongchatgpt.com/">Cộng Đồng ChatGPT Vietnam</a></b>', {reply_to_message_id: msg.message_id, parse_mode: 'HTML'})
	}).catch((err) => {
		bot.sendMessage(msg.chat.id, 'Limit API Exceeded. Please contact administrator.')
	})
});


bot.onText(/\/iae (.+)/, async (msg, match) => {
	// Show the "typing" action while generating the code
	bot.sendChatAction(msg.chat.id, 'upload_photo');

	// Get the user input from the message
	const resp = match[1];
	const startTime = Date.now();

	// Generate the code using the Local API
	axios.post('https://api.13xlabs.com/api/image/generate-images-anime', {
		prompt: resp,
		negative_prompt: null,
		width: 768,
		height: 768,
		num_outputs: 1,
		num_inference_steps: 50,
		guidance_scale: 12,
		scheduler: "DPMSolverMultistep",
		seed: null
	}, {
        headers: {
          Authorization: `Token ${process.env.XLABS_TOKEN}`,
        }
      }).then(response => {
		// Calculate the latency
		const endTime = Date.now();
		const timeTaken = (endTime - startTime) / 1000;
		// Send the result to the user
		const message = `<a href="${response.data[0]}">Image</a>\n\nLatency: ${timeTaken}s\n\n<b><a href="https://t.me/+FmApN6hcCtFmZTdl">Join ChatGPT Community</a> | <a href="https://congdongchatgpt.com/">Cộng Đồng ChatGPT Vietnam</a></b>`;
		bot.sendMessage(msg.chat.id, message, {
			reply_to_message_id: msg.message_id,
			parse_mode: 'HTML'
		});
	}).catch(error => {
		bot.sendMessage(msg.chat.id, 'Limit API Exceeded. Please contact administrator.')
	});
});

bot.onText(/\/ivip (.+)/, async (msg, match) => {
	// Show the "typing" action while generating the code
	bot.sendChatAction(msg.chat.id, 'upload_photo');

	// Get the user input from the message
	const resp = match[1];
	if (resp.length > 200) {
		// Send a message to the user if the input is too long
		bot.sendMessage(msg.chat.id, 'The description is too long. Please enter a description shorter than 200 characters.')
		return;
	}
	const startTime = Date.now();

	// Generate the code using the Local API
	axios.post('https://api.13xlabs.com/api/image/generate-images-stable-diffusion/', {
		prompt: resp,
		image_dimensions: "768x768",
		negative_prompt: null,
		num_outputs: 1,
		num_inference_steps: 50,
		guidance_scale: 7.5,
		scheduler: "K_EULER",
		seed: null
	}, {
        headers: {
          Authorization: `Token ${process.env.XLABS_TOKEN}`,
        }
      }).then(response => {
		console.log(response.data[0])
		console.log(response.data)
		// Calculate the latency
		const endTime = Date.now();
		const timeTaken = (endTime - startTime) / 1000;
		// Send the result to the user
		const message = `<a href="${response.data[0]}">Image</a>\n\nLatency: ${timeTaken}s\n\n<b><a href="https://t.me/+FmApN6hcCtFmZTdl">Join ChatGPT Community</a> | <a href="https://congdongchatgpt.com/">Cộng Đồng ChatGPT Vietnam</a></b>`;
		bot.sendMessage(msg.chat.id, message, {
			reply_to_message_id: msg.message_id,
			parse_mode: 'HTML'
		});
	}).catch(error => {
		bot.sendMessage(msg.chat.id, 'Limit API Exceeded. Please contact administrator.')
	});
});

bot.onText(/\/imidjourney (.+)/, async (msg, match) => {
	// Show the "upload_photo" action while generating the code
	bot.sendChatAction(msg.chat.id, 'upload_photo');

	// Get the user input from the message
	const resp = match[1];
	const startTime = Date.now();
	if (resp.length > 200) {
		// Send a message to the user if the input is too long
		bot.sendMessage(msg.chat.id, 'The description is too long. Please enter a description shorter than 200 characters.')
		return;
	}

	// Generate the code using the Local API
	axios.post('https://api.13xlabs.com/api/image/generate-images-midjourney/', {
		prompt: resp,
		negative_prompt: null,
		width: 768,
		height: 768,
		prompt_strength: 0.8,
		num_outputs: 1,
		num_inference_steps: 50,
		guidance_scale: 7.5,
		scheduler: "K_EULER",
		seed: null
	}, {
        headers: {
          Authorization: `Token ${process.env.XLABS_TOKEN}`,
        }
      }).then(response => {
		console.log(response.data[0])
		console.log(response.data)
		// Calculate the latency
		const endTime = Date.now();
		const timeTaken = (endTime - startTime) / 1000;
		// Send the result to the user
		const message = `<a href="${response.data[0]}">Image</a>\n\nLatency: ${timeTaken}s\n\n<b><a href="https://t.me/+FmApN6hcCtFmZTdl">Join ChatGPT Community</a> | <a href="https://congdongchatgpt.com/">Cộng Đồng ChatGPT Vietnam</a></b>`;
		bot.sendMessage(msg.chat.id, message, {
			reply_to_message_id: msg.message_id,
			parse_mode: 'HTML'
		});
	}).catch(error => {
		bot.sendMessage(msg.chat.id, 'Limit API Exceeded. Please contact administrator.')
	});
});

bot.onText(/\/imidjourneyw (.+)/, async (msg, match) => {
	// Show the "upload_photo" action while generating the code
	bot.sendChatAction(msg.chat.id, 'upload_photo');

	// Get the user input from the message
	const resp = match[1];
	const startTime = Date.now();
	if (resp.length > 200) {
		// Send a message to the user if the input is too long
		bot.sendMessage(msg.chat.id, 'The description is too long. Please enter a description shorter than 200 characters.')
		return;
	}

	// Generate the code using the Local API
	axios.post('https://api.13xlabs.com/api/image/generate-images-midjourney/', {
		prompt: resp,
		negative_prompt: null,
		width: 1024,
		height: 768,
		prompt_strength: 0.8,
		num_outputs: 1,
		num_inference_steps: 50,
		guidance_scale: 7.5,
		scheduler: "K_EULER",
		seed: null
	}, {
        headers: {
          Authorization: `Token ${process.env.XLABS_TOKEN}`,
        }
      }).then(response => {
		// Calculate the latency
		const endTime = Date.now();
		const timeTaken = (endTime - startTime) / 1000;
		// Send the result to the user
		const message = `<a href="${response.data[0]}">Image</a>\n\nLatency: ${timeTaken}s\n\n<b><a href="https://t.me/+FmApN6hcCtFmZTdl">Join ChatGPT Community</a> | <a href="https://congdongchatgpt.com/">Cộng Đồng ChatGPT Vietnam</a></b>`;
		bot.sendMessage(msg.chat.id, message, {
			reply_to_message_id: msg.message_id,
			parse_mode: 'HTML'
		});
	}).catch(error => {
		bot.sendMessage(msg.chat.id, 'Limit API Exceeded. Please contact administrator.')
	});
});

bot.onText(/\/imidjourneyh (.+)/, async (msg, match) => {
	// Show the "upload_photo" action while generating the code
	bot.sendChatAction(msg.chat.id, 'upload_photo');

	// Get the user input from the message
	const resp = match[1];
	const startTime = Date.now();
	if (resp.length > 200) {
		// Send a message to the user if the input is too long
		bot.sendMessage(msg.chat.id, 'The description is too long. Please enter a description shorter than 200 characters.')
		return;
	}

	// Generate the code using the Local API
	axios.post('https://api.13xlabs.com/api/image/generate-images-midjourney/', {
		prompt: resp,
		negative_prompt: null,
		width: 768,
		height: 1024,
		prompt_strength: 0.8,
		num_outputs: 1,
		num_inference_steps: 50,
		guidance_scale: 7.5,
		scheduler: "K_EULER",
		seed: null
	}, {
        headers: {
          Authorization: `Token ${process.env.XLABS_TOKEN}`,
        }
      }).then(response => {
		console.log(response.data[0])
		console.log(response.data)
		// Calculate the latency
		const endTime = Date.now();
		const timeTaken = (endTime - startTime) / 1000;
		// Send the result to the user
		const message = `<a href="${response.data[0]}">Image</a>\n\nLatency: ${timeTaken}s\n\n<b><a href="https://t.me/+FmApN6hcCtFmZTdl">Join ChatGPT Community</a> | <a href="https://congdongchatgpt.com/">Cộng Đồng ChatGPT Vietnam</a></b>`;
		bot.sendMessage(msg.chat.id, message, {
			reply_to_message_id: msg.message_id,
			parse_mode: 'HTML'
		});
	}).catch(error => {
		bot.sendMessage(msg.chat.id, 'Limit API Exceeded. Please contact administrator.')
	});
});
// Listen for any kind of message. There are different kinds of messages.
bot.startPolling();