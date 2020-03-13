const randomLeague = require('./randomChamp');
const eightBall = require('./eightball');
const time = require('./timeZone');
const stats = require('./winRateChamp');
const help = require('./help');
const status = require('./playerRate');
const overWatch = require('./overWatchStats');
const virus = require('./virusStatistic');
const spamProtection = new Set();

const testChannelID = process.env.CHANNEL_ID;
const botChannelID = process.env.BOTCHANNEL_ID;

const commands = {
	'8league': randomLeague,
	'8ball': eightBall,
	'ow': overWatch,
	virus,
	help,
	time,
	stats,
	status
};

module.exports = async msg => {
	if (msg.author.bot) return;
	try {
		if (msg.channel.id === testChannelID) {
			if (spamProtection.has(msg.author.id)) {
				msg.channel.send('You better stop ' + msg.author);
				return;
			}
			const args = msg.content.split(' ');
			if (args.length === 0 || args[0].charAt(0) !== '#') return;
			const command = args.shift().substr(1);
			if (Object.keys(commands).includes(command)) {
				spamProtection.add(msg.author.id);
				commands[command](msg, args);
			}
		}

		setTimeout(function() {
			spamProtection.delete(msg.author.id);
		}, 10000);
	} catch (err) {
		console.log(err);
	}
};
