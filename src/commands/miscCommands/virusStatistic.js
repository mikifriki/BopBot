const Discord = require('discord.js');
const axios = require('axios');

const get_virus_statistic = async (url) => {
	return await axios.get(url)
		.then((response => {
			return response.data;
		}));
};

const embeded = ({cases, deaths, recovered}) => new Discord.RichEmbed()
	.setColor(16773120)
	.setTitle('Fresh stats for yall fave toyota corolla virus. :heart_eyes: ')
	.addField(':zipper_mouth:**Coronavirus Cases**', `**${cases.toLocaleString('en')}**`)
	.addField('**:skull_crossbones:Deaths**', `${deaths.toLocaleString('en')}`)
	.addField('**:mask:**Recovered', `${recovered.toLocaleString('en')}`)
	.setTimestamp(new Date())
	.setFooter(':spill: We all finna die');

module.exports = async (msg, args) => {
	const url = `https://corona.lmao.ninja/v2/${ args.length == 0 ? 'all' : 'countries/' + args }`;
	await get_virus_statistic(url)
		.then((infectionData) => {
			msg.channel.send({ embed: embeded(infectionData) });
		})
		.catch(console.log);
};
