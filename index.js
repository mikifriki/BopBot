const Discord = require('discord.js');
require('dotenv').config();

const commandHandler = require('./src/commands');
const client = new Discord.Client();
const MAINCHANNEL_ID = process.env.MAINCHANNEL_ID;

client.once('ready', () => {
	console.log('🤖 Beep beep! I am ready!');
});

client.once('disconnect', () => {
	console.log('🤖 Beep boop! I am gone!');
});


/* client.on('message', msg => {
	if (msg.channel.type === 'dm') {
		client.channels.get(MAINCHANNEL_ID).send(msg.content);
	}
}); */

client.on('message', commandHandler);

client.login(process.env.BOT_TOKEN);
