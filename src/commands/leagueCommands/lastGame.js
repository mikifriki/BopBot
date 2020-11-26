const rp = require('request-promise');
const $ = require('cheerio');

let gameInfo = [],
	gameKDAData = [];

async function getPlayerData(opURL, lolProfileURL) {
	rp(opURL)
		.then(function(html) {
			gameInfo = [];
			for (let i = 0; i < 1; i++) {
				gameInfo.push({
					Win:
						$('.GameResult', html)
							.map((i, ele) => $(ele).text())
							.get()[i],
					ChampInfo:
						$('.GameSettingInfo > .ChampionName > a', html)
							.map((i, ele) => $(ele).text())
							.get()[i],
					WinRate:
						$('.winratio', html)
							.map((i, ele) => $(ele).text())
							.get()[i]
				});
			}
			return gameInfo;
		});
	rp(lolProfileURL)
		.then(function(html) {
			gameKDAData = [];
			for (let i = 0; i < 3; i++) {
				gameKDAData.push(
					$('.kda > .num', html)
						.map((i, ele) => $(ele).text())
						.get()[i]
				);
				
		
			}
			return gameKDAData;
		});
	return {gameKDAData, gameInfo};
}

module.exports = async (msg, args) => {
	let opURL = `https://euw.op.gg/summoner/userName=${args}`;
	let lolProfileURL = `https://lolprofile.net/summoner/euw/${args}`;

	if (!args.length) return;
	await getPlayerData(opURL, lolProfileURL)
		.then(() => {
			msg.channel.send(
				`${msg.author} With a win ratio of ${gameInfo[0].WinRate} the last game ended with a __${gameInfo[0].Win.toString().trim()}__ and a KDA of ${gameKDAData[0]}/${gameKDAData[1]}/${gameKDAData[2]} while playing **${gameInfo[0].ChampInfo}**`
			);
		}).catch(console.log);
		if (gameKDAData === [undefined] || gameInfo === undefined) return;
};

