const rp = require('request-promise');
const $ = require('cheerio');
let opURL = '';
let lolProfileURL = '';
let gameInfo = [],
	gameKDAData = [];

async function get_player_data () {
	try {
		return rp(opURL)
			.then(function (html) {
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
	} catch (err) {
		console.log(err);
	}
}

async function get_kda_data () {
	try {
		return rp(lolProfileURL)
			.then(function (html) {
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
	} catch (err) {
		throw `An error has occurred ${err}`;
	}
}

module.exports = async (msg, args) => {
	opURL = `https://euw.op.gg/summoner/userName=${args}`;
	lolProfileURL = `https://lolprofile.net/summoner/euw/${args}`;

	if (!args.length) return;
	if (gameKDAData === [undefined] || gameInfo === undefined) return;
	await get_player_data();
	await get_kda_data();
	try {
		await msg.channel.send(
			`${msg.author} With a win ratio of ${gameInfo[0].WinRate} the last game ended with a __${gameInfo[0].Win.toString().trim()}__ and a KDA of ${gameKDAData[0]}/${gameKDAData[1]}/${gameKDAData[2]} while playing **${gameInfo[0].ChampInfo}**`
		);
	} catch (err) {
		console.log(err);
	}
};

