const rp = require('request-promise');
const $ = require('cheerio');
let opGGUrl = '';
let soloRank = [];

async function getPlayerRank () {
	try {
		return rp(opGGUrl)
			.then(function (html) {
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
				return soloRank;
			});
	} catch (err) {
		console.log(err);
	}
}

module.exports = async (msg, args) => {
	opGGUrl = `https://euw.op.gg/summoner/userName=${args}`;

	if (!args.length) return;
	if (soloRank[0] === [undefined] || soloRank[1] === [undefined]) return;

	await getPlayerRank();
	try {
		await msg.channel.send(
			`${msg.author} ${args} is hardstuck in ${soloRank[0]} with a winrate of ${soloRank[1].toString().trim()}`
		);
	} catch (err) {
		console.log(err);
	}
};

