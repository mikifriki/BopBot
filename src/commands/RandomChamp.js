const scores = require('./info.json');

var items = [];
module.exports = async msg => {
	const i = Math.floor(Math.random() * scores.Champion.length);
	let reply = scores.Champion[i];
	
	items.length = 0;
	for (let j = 0; j < 5; j++) {
		let rand = scores.items[Math.floor(Math.random() * scores.items.length)];
		items.push(rand);
	}

	await msg.channel.send({embed: {
		color: 16773120,
		title: `This is your loadout ${msg.author.username}`,
		description: "Use this build at your own risk",
		"image": {
			"url": "https://i1.wp.com/www.lolnews.com/wp-content/uploads/2019/10/Have-Fun.jpeg?fit=602%2C601&ssl=1"
		  },
		fields: [{
			name: "**Champion**",
			value: `**${reply}**`
		  },
		  {
			name: "**Items**🤔",
			value: `${items}`
		  }
		],
		timestamp: new Date(),
		footer: {
		  text: "This whole things fucked"
		}
	  }
	});
};
