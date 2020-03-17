const randomLeague = require('./leagueCommands/randomChamp');
const stats = require('./leagueCommands/championStats');
const outcome = require('./leagueCommands/lastGame');
const rank = require('./leagueCommands/playerRank');
const eightBall = require('./miscCommands/eightball');
const time = require('./miscCommands/timeZone');
const help = require('./miscCommands/help');
const overWatch = require('./owCommands/overWatchStats');
const virus = require('./miscCommands/virusStatistic');
const suggestions = require('./miscCommands/suggestions');
const spamProtection = new Set();

const testChannelID = process.env.TESTCHANNEL_ID;
const botChannelID = process.env.BOTCHANNEL_ID;
const suggestionsID = process.env.ANNOUCEMENT_ID;

const commands = {
	'8league': randomLeague,
	'8ball': eightBall,
	'ow': overWatch,
	'suggest': suggestions,
	rank,
	virus,
	help,
	time,
	stats,
	outcome
};

module.exports = async msg => {
	if (msg.author.bot) return;
	try {
		if (msg.channel.id === botChannelID || suggestionsID) {
			const args = msg.content.split(' ');
			const command = args.shift().substr(1);
			if (args.length === 0 || args[0].charAt(0) !== '#') return;
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
