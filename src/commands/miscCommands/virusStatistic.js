const Discord = require('discord.js');
const axios = require('axios');
let infectionData;

async function get_virus_statistic(url) {
	await axios.get(url)
		.then((response => {
			return infectionData = response.data;
		}))
		.catch(function(error) {
			if (error.response.status === 404) return;
		});
}

let embeded = infectionData => new Discord.RichEmbed()
	.setColor(16773120)
	.setTitle('Fresh stats for yall fave toyota corolla virus. :heart_eyes: ')
	.addField(':zipper_mouth:**Coronavirus Cases**', `**${infectionData.cases.toLocaleString('en')}**`)
	.addField('**:skull_crossbones:Deaths**', `${infectionData.deaths.toLocaleString('en')}`)
	.addField('**:mask:**Recovered', `${infectionData.recovered.toLocaleString('en')}`)
	.setTimestamp(new Date())
	.setFooter(':spill: We all finna die');

module.exports = async (msg, args) => {
	let url;
	infectionData = undefined;
	if (!args.length) {
		url = 'https://corona.lmao.ninja/all';
	} else {
		url = `https://corona.lmao.ninja/countries/${args}`;
	}
	await get_virus_statistic(url);
	if (infectionData === undefined) {
		return msg.channel.send('You have entered an incorrect country.');
	} else {
		await msg.channel.send({
			embed: embeded(infectionData)
		});
	}
};
