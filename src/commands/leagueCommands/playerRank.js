const rp = require('request-promise');
const $ = require('cheerio');

let soloRank = [];

async function getPlayerRank(opGGUrl) {
	try {
		return rp(opGGUrl)
			.then(function(html) {
				soloRank = [];
				for (let i = 0; i < 1; i++) {
					soloRank.push(
						$('.TierRank', html)
							.map((i, ele) => $(ele).text())
							.get()[i],
						$('.LeaguePoints', html)
							.map((i, ele) => $(ele).text())
							.get()[i]
					);
				}
				console.log('fetching player rank');
				return soloRank;
			});
	} catch (err) {
		console.log(err);
	}
}

module.exports = async (msg, args) => {
	let opGGUrl = `https://euw.op.gg/summoner/userName=${args}`;

	if (!args.length) return;
	if (soloRank[0] === [undefined] || soloRank[1] === [undefined]) return;

	await getPlayerRank(opGGUrl);
	try {
		await msg.channel.send(
			`${msg.author} ${args} is hardstuck in ${soloRank[0]} with lp of ${soloRank[1].toString().trim()}`
		);
	} catch (err) {
		console.log(err);
	}
};

