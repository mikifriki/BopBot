const Discord = require('discord.js');
require('dotenv').config();

const commandHandler = require('./commands');
const client = new Discord.Client();
const MAINCHANNEL_ID = process.env.MAINCHANNEL_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once('ready', () => {
	console.log('🤖 Beep beep! I am ready!');
});

client.on('message', msg => {
	if (msg.channel.type === 'dm') {
		client.channels.get(MAINCHANNEL_ID).send(msg.content);
	}
});

client.on('message', commandHandler);

client.login(process.env.BOT_TOKEN);
