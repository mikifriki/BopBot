const rp = require('request-promise');
const $ = require('cheerio');
let url = '';
let championRate = [],
	banRate = [],
	deathRate = [];

async function get_data_id() {
	try {
		return rp(url)
			.then(function(html) {
				championRate = [];
				banRate = [];
				deathRate = [];

				championRate.push(
					$('#statistics-win-rate-row > td:nth-child(2)', html)
						.map((i, ele) => $(ele).text())
						.get()
				);
				banRate.push(
					$('#statistics-ban-rate-row-row> td:nth-child(2)', html)
						.map((i, ele) => $(ele).text())
						.get()
				);
				deathRate.push(
					$('#statistics-deaths-row > td:nth-child(2) ', html)
						.map((i, ele) => $(ele).text())
						.get()
				);
				return { championRate, banRate, deathRate };
			});
	} catch (err) {
		console.log(err);
	}
}

module.exports = async (msg, args) => {
	try {
		url = `https://champion.gg/champion/${args}`;
		if (!args.length) return;
		if (championRate === undefined || banRate === undefined) return;
		await get_data_id();
		await msg.channel.send({
			embed: {
				color: 16773120,
				title: `The stats for ${args}`,
				fields: [{
					name: '**Winrate**',
					value: `**${championRate.toString().trim()}**`
				},
					{
						name: '**BanRate**🤔',
						value: `${banRate.toString().trim()}`
					},
					{
						name: '**Average Deaths per game**',
						value: `${deathRate.toString().trim()}% `
					}
				],
				timestamp: new Date(),
				footer: {
					text: 'This whole things fucked'
				}
			}
		});
	} catch (err) {
		console.log(err);
	}
};
