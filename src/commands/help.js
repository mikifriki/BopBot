module.exports = async (msg) => {
	if (msg.author.bot) return;
	await msg.channel.send({
		embed: {
			color: 16773120,
			title: 'List of commands',
			description: 'Here are the full commands',
			fields: [
				{
					name: 'Test',
					value: '```8league (Champion) or leave empty for a full build \ntime (Region/City)\nstats (Champion)```'
				},
				{
					name: '**Examples**',
					value: '```\n8league Sona or 8league \ntime Europe/Tallinn\nstats Ahri```'
				}
			]
		}
	});
};
