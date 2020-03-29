const axios = require('axios');
const cheerio = require('cheerio');
let playerInfo = [];

async function get_ow_data(url) {
	const html = await axios.get(url);
	const $ = await cheerio.load(html.data);
	playerInfo = [];
	$('.infobox').each((i, ele) => {
		if (i <= 4) {
			playerInfo.push({
				title: $(ele).find('span.title').text(),
				stats: $(ele).find('span.value').text()
			});
		}
	});
	return playerInfo;
}

module.exports = async (msg, args) => {
	try {
		let url = `https://overwatchtracker.com/profile/pc/global/${args}`;
		await get_ow_data(url);
		if (!args.length) return;
		await msg.channel.send(
			`Level; ${playerInfo[1].stats}, Winrate: ${playerInfo[2].stats}, Main hero: ${playerInfo[4].stats}`
		);
	} catch (err) {
		console.log(err);
	}
};
