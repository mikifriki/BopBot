const axios = require('axios');
let infectionData;

async function get_virus_statistic(url) {
	await axios.get(url)
		.then((response) => {
			return infectionData = response.data;
		})
		.catch(console.log);
}

module.exports = async (msg, args) => {
	let url;
	if (!args.length) {
		url = 'https://corona.lmao.ninja/all';
	} else {
		url = `https://corona.lmao.ninja/countries/${args}`;
	}
	await get_virus_statistic(url);
	await msg.channel.send({
		embed: {
			color: 16773120,
			title: 'Fresh stats for yall fave toyota corolla virus. :heart_eyes: ',
			fields: [
				{
					name: ':zipper_mouth:**Coronavirus Cases**',
					value: `**${infectionData.cases.toLocaleString('en')}**`
				},
				{
					name: '**:skull_crossbones:Deaths:**',
					value: `${infectionData.deaths.toLocaleString('en')}`
				},
				{
					name: '**:mask:**Recovered**',
					value: `${infectionData.recovered.toLocaleString('en')}`
				}],
			timestamp: new Date(),
			footer: {
				text: ':spill: We all finna die'
			}
		}
	});
};

