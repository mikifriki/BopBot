const dataArray = require('../info.json');
let items = [];

module.exports = async (msg, args) => {
	try {
		items.length = 0;

		const i = Math.floor(Math.random() * dataArray.Champion.length);
		let reply = dataArray.Champion[i];

		for (let j = 0; j < 5; j++) {
			let rand = dataArray.items[Math.floor(Math.random() * dataArray.items.length)];
			items.push(rand);
		}

		if (!args.length) {
			await msg.channel.send({
				embed: {
					color: 16773120,
					title: `This is your loadout ${msg.author.username}`,
					description: 'Use this build at your own risk',
					'image': {
						'url': 'https://i1.wp.com/www.lolnews.com/wp-content/uploads/2019/10/Have-Fun.jpeg?fit=602%2C601&ssl=1'
					},
					fields: [
						{
							name: '**Champion**',
							value: `**${reply}**`
						},
						{
							name: '**Items**🤔',
							value: `${items}`
						}
					],
					timestamp: new Date(),
					footer: {
						text: 'This whole things fucked'
					}
				}
			});
		} else if (`${args}` === 'champ') {
			await msg.channel.send(`${msg.author} ${reply}`);
		}
	} catch (err) {
		console.log(err);

	}
};
