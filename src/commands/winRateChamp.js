const rp = require('request-promise');
const $ = require('cheerio');
let url = '';

let championRate = [],
	banRate = [],
	deathRate = [];

let stringedWinRate = null,
	stringedBanRate = null,
	stringedDeathRate = null;

async function get_data_id() {
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
			return [championRate, banRate, deathRate];
		})
		.catch(function(err) {
			console.log(err);
		});
}

async function stringifyChampions() {
	championRate = await get_data_id();
	banRate = await get_data_id();
	deathRate[2] = await get_data_id();

	stringedWinRate = JSON.stringify(championRate);
	stringedBanRate = JSON.stringify(banRate);
	stringedDeathRate = JSON.stringify(deathRate);
	stringedDeathRate = JSON.stringify(deathRate);
}

module.exports = async (msg, args) => {
	url = `https://champion.gg/champion/${args}`;
	if (!args.length) return;
	await stringifyChampions();
	if (stringedWinRate === undefined || stringedBanRate === undefined) return;
	await msg.channel.send({
		embed: {
			color: 16773120,
			title: `The stats for ${args}`,
			fields: [{
				name: '**Winrate**',
				value: `**${stringedWinRate.replace(/[\n\s\t"\\%n\][]/g, '')} %**`
			},
			{
				name: '**BanRate**🤔',
				value: `${stringedBanRate.replace(/[\n\r\s\t"\\%n\][]/g, '')} % `
			},
			{
				name: '**Avarage Deaths per game**',
				value: `${stringedDeathRate.replace(/[\n\r\s\t"\\%n\][]/g, '')} % `
			}
			],
			timestamp: new Date(),
			footer: {
				text: 'This whole things fucked'
			}
		}
	}).catch((err) => {
		console.log(err);
	});
};
