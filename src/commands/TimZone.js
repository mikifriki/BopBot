const moment = require('moment-timezone');
let test = '';

module.exports = async (msg, args) => {
	if (!args.length) return;
	test = moment()
		.tz(`${args}`)
		.format('HH:mm');
	if (!moment.tz.zone()) {
		await msg.channel.send(
			`${msg.author} ${test}`
		);
	} else {
		await msg.channel.send(`${msg.author} This aint it sis (Not crrently supported)`);
	}
};
