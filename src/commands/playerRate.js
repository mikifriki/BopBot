const rp = require('request-promise');
const $ = require('cheerio');
let secondURL = '';

let gameWinInfo = null,
	gameChampInfo = null,
	gameKDAInfo = null,
	gameResult = null,
	gameChampion = null,
	gameKDA = null;

async function get_player_data() {
	return rp(secondURL)
		.then(function(html) {
			gameWinInfo = [];
			gameChampInfo = [];
			gameKDAInfo = [];

			for (let i = 0; i < 1; i++) {
				gameWinInfo.push(
					$('.GameResult', html)
						.map((i, ele) => $(ele).text())
						.get()[i]
				);
				gameChampInfo.push(
					$('.GameSettingInfo > .ChampionName > a', html)
						.map((i, ele) => $(ele).text())
						.get()[i]
				);
				gameKDAInfo.push(
					$('.winratio', html)
						.map((i, ele) => $(ele).text())
						.get()[i]
				);
			}
			gameKDA = JSON.stringify(gameKDAInfo);
			gameResult = JSON.stringify(gameWinInfo);
			gameChampion = JSON.stringify(gameChampInfo);

			return [gameResult, gameChampion];
		})
		.catch(function(err) {
			console.log(err);
		});
}

module.exports = async (msg, args) => {
	secondURL = `https://euw.op.gg/summoner/userName=${args}`;
	if (!args.length) return;
	await get_player_data();

	if (gameChampion === '[null]') return;
	await msg.channel.send(
		`${msg.author} With a win ratio of${gameKDA.slice(11, -2)} the last game ended with a __${gameResult.slice(26, -20)}__ while ${args} played **${gameChampion.slice(2, -2)}**`
	);
	

};
