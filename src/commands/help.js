module.exports = async (msg) => {
	try {
		if (msg.author.bot) return;
		console.log('called');
		await msg.channel.send({
			embed: {
				color: 16773120,
				title: 'List of commands',
				description: 'Here are the full commands',
				fields: [
					{
						name: 'Test',
						value: '```' +
							'#8league (Champion) or leave empty for a full build ' +
							'\n#time (Region/City)\n#stats (Champion)\n#8ball for random awnser' +
							'\n#ow (playerName) for overwatch stats.\n#virus for Corona virus update' +
							'\n#Status (Player name) for the outcome of a players last lol match```'
					},
					{
						name: '**Examples**',
						value: '```\n#8league Sona or #8league ' +
							'\n#time Europe/Tallinn\n#stats Ahri' +
							'\n#8ball\n#ow EvilG0\n#virus\n#status PussayDestroyer```'
					}
				]
			}
		});
	} catch (err) {
		console.log(err);
	}
};
