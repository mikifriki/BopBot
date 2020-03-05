const rp = require('request-promise');
var url = ``;
const $ = require('cheerio');
var Champion = [];

async function get_data_id() {
	return rp(url)
		.then(function(html) {
			Champion = [];
			for (let i = 0; i < 1; i++) {
				Champion.push(
					$('#statistics-win-rate-row > td:nth-child(2)', html)
						.map((i, ele) => $(ele).text())
						.get()[i]
				);
			}

			return Champion;

			/* console.log(Champion[0].replace(/[\n\r\s\t]+/g, '')); */
		})
		.catch(function(err) {
			console.log(err);
		});
}

module.exports = async (msg, args) => {
	url = `https://champion.gg/champion/${args}`;
	if (!args.length) return;
	let stringedChampion = JSON.stringify(Champion);
	await msg.channel.send(
		`The winrate is ${stringedChampion.replace(/[\n\r\s\t"\\n\][]/g, '')} `
	);
	Champion = await get_data_id();
	console.log(ne);
	console.log(get_data_id(Champion));
};
