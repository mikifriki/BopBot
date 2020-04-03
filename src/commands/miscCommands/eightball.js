let eightBallAnswers = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Yes - definitely',
	'You may rely on it', 'As I see it, yes', 'Most likely', 'Yes', 'Signs point to yes', 'Reply hazy, try again',
	' Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Dont count on it', 'My reply is no',
	'My sources say no', 'Outlook not so good', 'Very doubtful'];

module.exports = async (msg) => {
	try {
		let ranAnswer = eightBallAnswers[Math.floor(Math.random() * eightBallAnswers.length)];
		await msg.channel.send(
			`${msg.author} ${ranAnswer}`
		);
	} catch (err) {
		console.log(err);
	}
};
