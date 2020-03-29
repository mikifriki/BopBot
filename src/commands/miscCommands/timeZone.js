const moment = require('moment-timezone');

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
	let locationTime;
	if (!args.length) return;
	locationTime = moment()
		.tz(`${args}`)
		.format('HH:mm');

	if (isValidTimeZone(args) === false) {
		await msg.channel.send(
			`${msg.author} This aint it sis (Not crrently supported timezone)`
		);
	} else {
		await msg.channel.send(`${msg.author} ${locationTime}`);
	}
};
