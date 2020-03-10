const rp = require('request-promise');
const $ = require('cheerio');
let secondURL = '';
let mainURL = '';
let gameWinInfo = [],
	gameChampInfo = [],
	gameWinRateInfo = [],
	gameKDAData = [];

async function get_player_data() {
	try {
		return rp(secondURL)

			.then(function(html) {
				gameWinInfo = [];
				gameChampInfo = [];
				gameWinRateInfo = [];
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
					gameWinRateInfo.push(
						$('.winratio', html)
							.map((i, ele) => $(ele).text())
							.get()[i]
					);
				}
				return {gameWinRateInfo, gameWinInfo, gameChampInfo};
			});
	}
	catch(err) {
		console.log(err);
	}
}

async function get_kda_data() {
	try {
		return rp(mainURL)
			.then(function(html) {
				for (let i = 0; i < 3; i++) {
					gameKDAData.push(
						$('.kda > .num', html)
							.map((i, ele) => $(ele).text())
							.get()[i]
					);
				}
				return gameKDAData;
			});
	}
	catch(err) {
		throw `An error has occured ${err}`;
	}
}

module.exports = async (msg, args) => {
	secondURL = `https://euw.op.gg/summoner/userName=${args}`;
	mainURL = `https://lolprofile.net/summoner/euw/${args}`;
	if (!args.length) return;
	if (gameKDAData === [undefined] || gameChampInfo === []) return;

	await get_player_data();
	await get_kda_data();
	try {
		await msg.channel.send(
			`${msg.author} With a win ratio of ${gameWinRateInfo} the last game ended with a __${gameWinInfo.toString().trim()}__ and a KDA of ${gameKDAData[0]}/${gameKDAData[1]}/${gameKDAData[2]} while playing **${gameChampInfo}**`
		);
	}
	catch(err) {
		console.log(err);
	}
};
