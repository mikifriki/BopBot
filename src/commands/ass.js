const moment = require('moment-timezone');

let test = '';

module.exports = async (msg, args) => {
	if (!args.length) return;
	test = moment()
		.tz(`Europe/${args}`)
		.format('HH:mm');
	await msg.channel.send(`${msg.author} ${test}`);
};
