let Owlbot = require('owlbot-js');
let client = Owlbot('204cc650f26bc352219717ca4adf1e5d31050548');


module.exports = async (msg, args) => {
	client.define(args)
		.then((result) => {
			msg.channel.send(
				`${msg.author} The definition of ${args} is ${result.definitions[0].definition}`
			);
		}).catch(console.log);
};
