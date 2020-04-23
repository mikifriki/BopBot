const axios = require('axios');
const apiKey = process.env.TRACKER_KEY;

const getApexData = async url => await axios.get(url, { headers: { 'TRN-Api-Key': apiKey } })
	.then((response => {
		return response.data;
	}));

module.exports = async (msg, args) => {
	let url = `https://public-api.tracker.gg/v2/apex/standard/profile/origin/${args}`;
	if (!args.length) return;
	await getApexData(url)
		.then((data) => {
			const generalData = data.data.segments[0].stats;
			const rank = data.data.segments[0].stats.rankScore;
			if (url === 'https://public-api.tracker.gg/v2/apex/standard/profile/origin/0sugoidesune') {
				msg.channel.send(
					`Level: ${generalData.level.displayValue}, Kills: ${generalData.kills.displayValue}, Rank Score: ${rank.displayValue}, Stuck in: ${rank.metadata.rankName}, Hotel? Trivago`
				);
			} else {
				msg.channel.send(
					`Level: ${generalData.level.displayValue}, Kills: ${generalData.kills.displayValue}, Rank Score: ${rank.displayValue}, Rank: ${rank.metadata.rankName}, Hotel? Trivago`
				);
			}
		}).catch(console.log);
};

