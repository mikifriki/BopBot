const rp = require('request-promise');
const $ = require('cheerio');
let championData = [];

async function get_data_id(url) {
	try {
		return rp(url)
			.then(function(html) {
				championData.push({
					Winrate:
						$('#statistics-win-rate-row > td:nth-child(2)', html)
							.map((i, ele) => $(ele).text())
							.get(),
					Banrate:
						$('#statistics-ban-rate-row-row> td:nth-child(2)', html)
							.map((i, ele) => $(ele).text())
							.get(),
					Deathrate:
						$('#statistics-deaths-row > td:nth-child(2) ', html)
							.map((i, ele) => $(ele).text())
							.get()
				});
				return championData;
			});
	} catch (err) {
		console.log(err);
	}
}

module.exports = async (msg, args) => {
	try {
		let url = `https://champion.gg/champion/${args}`;
		if (!args.length) return;
		await get_data_id(url);
		await msg.channel.send({
			embed: {
				color: 16773120,
				title: `The stats for ${args}`,
				fields: [
					{
						name: '**Winrate**',
						value: `**${championData[0].Winrate.toString().trim()}**`
					},
					{
						name: '**BanRate**🤔',
						value: `${championData[0].Banrate.toString().trim()}`
					},
					{
						name: '**Average Deaths per game**',
						value: `${championData[0].Deathrate.toString().trim()}% `
					}
				],
				timestamp: new Date(),
				footer: {
					text: 'This whole things fucked'
				}
			}
		});
		if (championData[0] === undefined)
			} catch (err) {
		console.log(err);
		console.clear();
	}
};
