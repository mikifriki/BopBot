const axios = require('axios');
const apiKey = process.env.TRACKER_KEY;
let apexInfo = {};
//TRN-Api-Key: 3de2d922-9b88-41bf-b4a7-6ec34f2bd57f
async function get_ow_data(url) {
	await axios.get(url, {headers: {'TRN-Api-Key':apiKey} })
		.then((response) => {
			return apexInfo = response.data;
		})
		.catch(console.log);
}

module.exports = async (msg, args) => {
	let url = `https://public-api.tracker.gg/v2/apex/standard/profile/origin/${args}`
	await get_ow_data(url);
	const generalData = apexInfo.data.segments[0].stats;
	const rank = apexInfo.data.segments[0].stats.rankScore;
	try {
		if (url === 'https://public-api.tracker.gg/v2/apex/standard/profile/origin/0sugoidesune') {
			await msg.channel.send(
				`Level: ${generalData.level.displayValue}, Kills: ${generalData.kills.displayValue}, Rank Score: ${rank.displayValue}, Stuck in: ${rank.metadata.rankName}, Hotel? Trivago`
			);
		} else {
			await msg.channel.send(
				`Level: ${generalData.level.displayValue}, Kills: ${generalData.kills.displayValue}, Rank Score: ${rank.displayValue}, Rank: ${rank.metadata.rankName}, Hotel? Trivago`
			);
		}
	} catch (err) {
		console.log(err);
	}
};

