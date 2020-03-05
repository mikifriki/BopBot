const ping = require('./ping');
const eightBall = require('./RandomChamp');
const time = require('./TimZone');
const Stats = require('./WinRateChamp');

const guildID = process.env.GUILD_ID;
const channelID = process.env.CHANNEL_ID;
const botChannelID = process.env.BOTCHANNEL_ID;

const commands = {
	ping,
	'8league': eightBall,
	time,
	Stats,
};

module.exports = async msg => {
	if (msg.channel.id === channelID) {
		const args = msg.content.split(' ');
		if (args.length == 0 || args[0].charAt(0) !== '#') return;
		const command = args.shift().substr(1);
		if (Object.keys(commands).includes(command)) {
			commands[command](msg, args);
		}
	} 
};
