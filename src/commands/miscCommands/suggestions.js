module.exports = async (msg, args) => {
	if (msg.author.bot) return;
	try {
		let name = msg.author.username;
		await msg.channel.send({
			'embed': {
				title: `Suggestion by ${name}`,
				description: `${args}`,
				timestamp: Date.now()
			}
		}).then(sentEmbed => {
			sentEmbed.react('🤮');
			sentEmbed.react('😏');
		});
	} catch (err) {
		console.log(err);
	}
};
