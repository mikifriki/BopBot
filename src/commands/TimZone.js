const moment = require('moment-timezone');
let test = '';

function isValidTimeZone(tz) {
	if (!Intl || !Intl.DateTimeFormat()) {
		throw 'Time zones are not available in this environment';
	}

	try {
		Intl.DateTimeFormat(undefined, { timeZone: tz });
		return true;
	} catch (err) {
		return false;
	}
}

module.exports = async (msg, args) => {
	if (!args.length) return;
	test = moment()
		.tz(`${args}`)
		.format('HH:mm');

	console.log(test);
	if (isValidTimeZone(args) === false) {
		await msg.channel.send(
			`${msg.author} This aint it sis (Not crrently supported)`
		);
	} else {
		await msg.channel.send(`${msg.author} ${test}`);
	}
};
