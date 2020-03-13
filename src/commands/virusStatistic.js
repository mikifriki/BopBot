const axios = require('axios');
const cheerio = require('cheerio');

let url = '';
let infectionData = [];

async function get_virus_statistic() {
	const html = await axios.get(url);
	const $ = await cheerio.load(html.data);
	infectionData = [];
	try {
		$('.maincounter-number').each((i, ele) => {
			if (i <= 4) {
				infectionData.push(
					$(ele).find('span').text()
				);
			}
		});
		return infectionData;

	} catch (err) {
		console.log(err);
	}
}

module.exports = async (msg) => {
	url = 'https://www.worldometers.info/coronavirus/';
	await get_virus_statistic();
	try {
		await msg.channel.send({
				embed: {
					color: 16773120,
					title: 'Fresh stats for yall fave toyota corolla virus. :heart_eyes: ',
					fields: [{
						name: ':zipper_mouth:**Coronavirus Cases**',
						value: `**${infectionData[0]}**`
					},
						{
							name: '**:skull_crossbones:Deaths:**',
							value: `${infectionData[1]}`
						},
						{
							name: '**:mask:**Recovered**',
							value: `${infectionData[2]}`
						}
					],
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

