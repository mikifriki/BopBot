const axios = require('axios');

let url = '';
let infectionData = {};

async function get_virus_statistic() {
	await axios.get(url)
		.then((response) => {
			return infectionData = response.data;
		})
		.catch(function handleError(error) {
			console.log(error);
		});
}

module.exports = async (msg, args) => {
	try {
		if (!args.length) {
			url = 'https://corona.lmao.ninja/all';
		} else {
			url = `https://corona.lmao.ninja/countries/${args}`;
		}
		await get_virus_statistic();
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
			}
		);
	} catch (err) {
		console.log(err);
	}
};

