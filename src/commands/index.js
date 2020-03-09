const randomLeague = require('./randomChamp');
const eightBall = require('./eightball');
const time = require('./timeZone');
const stats = require('./winRateChamp');
const help = require('./help');
const status = require('./playerRate');

/*const guildID = process.env.GUILD_ID;*/
const testChannelID = process.env.CHANNEL_ID;
const botChannelID = process.env.BOTCHANNEL_ID;

const commands = {
	'8league': randomLeague,
	'8ball': eightBall,
	help,
	time,
	stats,
	status
};

module.exports = async msg => {
	if (msg.author.bot) return;
	if (msg.channel.id === testChannelID) {
		const args = msg.content.split(' ');
		if (args.length === 0 || args[0].charAt(0) !== '#') return;
		const command = args.shift().substr(1);
		if (Object.keys(commands).includes(command)) {
			commands[command](msg, args);
		}
	}
};
