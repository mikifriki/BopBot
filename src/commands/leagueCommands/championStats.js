const rp = require('request-promise');
const $ = require('cheerio');
let championData = [];

async function getDataId(url) {
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
}

module.exports = async (msg, args) => {
	let url = `https://champion.gg/champion/${args}`;
	if (!args.length) return;
	await getDataId(url)
		.then(() => {
			msg.channel.send({
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
		}).catch(console.log);
		if (championData[0] === undefined) return;
};
