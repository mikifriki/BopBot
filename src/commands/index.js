const eightBall = require('./RandomChamp');
const time = require('./TimZone');
const stats = require('./WinRateChamp');
const help = require('./Help');
const status = require('./PlayerRate');
/*const guildID = process.env.GUILD_ID;*/
const testChannelID = process.env.CHANNEL_ID;
/*const botChannelID = process.env.BOTCHANNEL_ID;*/

const commands = {
	help,
	'8league': eightBall,
	time,
	stats,
	status
};

module.exports = async msg => {
	if (msg.channel.id === testChannelID) {
		const args = msg.content.split(' ');
		if (args.length === 0 || args[0].charAt(0) !== '#') return;
		const command = args.shift().substr(1);
		if (Object.keys(commands).includes(command)) {
			commands[command](msg, args);
		}
	}
};
