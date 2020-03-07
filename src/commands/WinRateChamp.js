const rp = require('request-promise');
var url = '';
const $ = require('cheerio');

let championRate = [];
let banRate = [];
let placement = [];

async function get_data_id() {
	return rp(url)
		.then(function(html) {
			championRate = [];
			banRate = [];
			placement = [];
			for (let i = 0; i < 1; i++) {
				championRate.push(
					$('#statistics-win-rate-row > td:nth-child(2)', html)
						.map((i, ele) => $(ele).text())
						.get()[i],
				);
				banRate.push(
					$('#statistics-ban-rate-row-row> td:nth-child(2)', html)
						.map((i, ele) => $(ele).text())
						.get()[i]
				);
				placement.push(
					$('td:nth-child(2) > strong ', html)
						.map((i, ele) => $(ele).text())
						.get()[i]
				);

			}

			return [championRate, banRate, placement];
		})
		.catch(function(err) {
			console.log(err);
		});
}

module.exports = async (msg, args) => {
	url = `https://champion.gg/champion/${args}`;
	if (!args.length) return;

	let stringedWinRate = JSON.stringify(championRate);
	let stringedBanRate = JSON.stringify(banRate);

	await msg.channel.send({
		embed: {
			color: 16773120,
			title: `The stats for ${args}`,
			fields: [{
				name: '**Winrate**',
				value: `**${stringedWinRate.replace(/[\n\r\s\t"\\%n\][]/g, '')} %**`
			},
			{
				name: '**BanRate**🤔',
				value: `${stringedBanRate.replace(/[\n\r\s\t"\\%n\][]/g, '')} % `
			}
			],
			timestamp: new Date(),
			footer: {
				text: 'This whole things fucked'
			}
		}
	});

	championRate = await get_data_id();
	banRate[1] = await get_data_id();

	console.log(banRate);
};
