module.exports = async (msg) => {
	try {
		if (msg.author.bot) return;
		await msg.channel.send({
			embed: {
				color: 16773120,
				title: 'List of commands',
				description: 'Here are the full commands. Any text in () is meant to be you request\n ex: !rank Pussaydestroyer',
				fields: [
					{
						name: 'Test',
						value: '```' +
							'!8league (Champion) or leave empty for a full build ' +
							'\n!time (Region/City)\n!stats (Champion)\n!8ball for random awnser' +
							'\n!ow (playerName) for overwatch stats.\n!virus for Corona virus update' +
							'\n!outcome (Player name) for the outcome of a players last lol match' +
							'\n!rank (Player name) for the current rank and lp of a player' +
							'\n!suggest (your suggestion) for a any suggestion you want.```'
					},
					{
						name: '**Music Bot Commands**',
						value:
							'```' +
							'\n!bop play(playlist) or !bop play (song) ' +
							'\n!bop stop' +
							'\n!bop pause' +
							'\n!bop resume' +
							'\n!bop skip' +
							'\n!bop np' +
							'```'
					},
					{
						name: '**Examples**',
						value: '```\n!8league Sona or !8league ' +
							'\n!time Europe/Tallinn\n!stats Ahri' +
							'\n!8ball\n!ow EvilG0\n!corona\n!status PussayDestroyer' +
							'\n!rank HayaiDesuChan' +
							'\n!suggest Is this bad?```'
					}
				]
			}
		});
	} catch (err) {
		console.log(err);
	}
};
