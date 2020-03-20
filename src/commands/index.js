const { Util } = require('discord.js');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_KEY); //API KEY DO NOT COMMIT!!!!

const randomLeague = require('./leagueCommands/randomChamp');
const stats = require('./leagueCommands/championStats');
const outcome = require('./leagueCommands/lastGame');
const rank = require('./leagueCommands/playerRank');
const eightBall = require('./miscCommands/eightball');
const time = require('./miscCommands/timeZone');
const help = require('./miscCommands/help');
const overWatch = require('./owCommands/overWatchStats');
const virus = require('./miscCommands/virusStatistic');
const suggestions = require('./miscCommands/suggestions');

const spamProtection = new Set();
const queue = new Map();

const testChannelID = process.env.TESTCHANNEL_ID;
const botChannelID = process.env.BOTCHANNEL_ID;
const suggestionsID = process.env.ANNOUCEMENT_ID;

const commands = {
	'8league': randomLeague,
	'8ball': eightBall,
	'ow': overWatch,
	'suggest': suggestions,
	rank,
	virus,
	help,
	time,
	stats,
	outcome
};


module.exports = async msg => {
	if (msg.author.bot) return;
	try {
		if (msg.channel.id === botChannelID || suggestionsID) {
			const args = msg.content.split(' ');
			if (args.length === 0 || args[0].charAt(0) !== '#') return;
			const command = args.shift().substr(1);
			if (Object.keys(commands).includes(command)) {
				spamProtection.add(msg.author.id);
				commands[command](msg, args);
			}
		}
		const serverQueue = queue.get(msg.guild.id);
		if (msg.content.startsWith('#play')) {
			const args = msg.content.split(' ');
			const url = args[1].replace(/<(.+)>/g, '$1');
			const searchString = args.slice(1).join(' ');
			const voiceChannel = msg.member.voiceChannel;

			if (!voiceChannel) return msg.channel.send('You need to be in a voice channel');
			const permissions = voiceChannel.permissionsFor(msg.client.user);
			if (!permissions.has('CONNECT')) {
				msg.channel.send('Permissions error');
			}
			if (!permissions.has('SPEAK')) {
				msg.channel.send('No Speak rights');
			}

			if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
				const playlist = await youtube.getPlaylist(url);
				const videos = await playlist.getVideos();
				msg.channel.send(`Playlist: ${playlist.title} has been added`);
				for (const video of Object.values(videos)) {
					const video2 = await youtube.getVideoByID(video.id);
					await handleVideo(video2, msg, voiceChannel, true);
				}
			} else {
				try {
					var video = await youtube.getVideo(url);
				} catch (err) {
					try {
						if (videos === undefined || video === undefined) return;
						var videos = await youtube.searchVideos(searchString, 1);
						var video = await youtube.getVideoByID(videos[0].id);
					} catch (err) {
						console.log(err);
					}
				}
				return handleVideo(video, msg, voiceChannel);
			}
		} else if (msg.content.startsWith(`#skip`)) {
			if (!serverQueue) return msg.channel.send('There is nothing playing');
			serverQueue.connection.dispatcher.end();
			return undefined;
		} else if (msg.content.startsWith(`#stop`)) {
			if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel');
			if (serverQueue.songs == undefined) return;
			serverQueue.songs = [];
			serverQueue.connection.dispatcher.end();
		} else if (msg.content.startsWith('#np')) {
			if (!serverQueue) return msg.channel.send('There is nothing playing');
			return msg.channel.send(`Now playing: ${serverQueue.songs[0].title} `);
		} else if (msg.content.startsWith('#queue')) {
			if (!serverQueue) return msg.channel.send('There is nothing playing');
			return msg.channel.send(`
			__**The Queue**__
${serverQueue.songs.map(song => `${song.title}`).join('\n')}
			
			__**Current song**__${serverQueue.songs[0].title};
			`);
		} else if (msg.content.startsWith('#pause')) {
			if (serverQueue && serverQueue.playing) {
				serverQueue.playing = false;
				serverQueue.connection.dispatcher.pause();
				return msg.channel.send('The song is paused');
			}
			return msg.channel.send('There is nothing playing');
		} else if (msg.content.startsWith('#resume')) {
			if (serverQueue && !serverQueue.playing) {
				serverQueue.playing = true;
				serverQueue.connection.dispatcher.resume();
				return msg.channel.send('The song is resumed');
			}
			return msg.channel.send('There is nothing playing');
		}
		setTimeout(function() {
			spamProtection.delete(msg.author.id);
		}, 10000);
	} catch (err) {
		{
			console.log(err);
		}
	}
}
;

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct); // sets values to the queueConstruct from guild

		queueConstruct.songs.push(song); // gives access to songs array;

		try {
			queueConstruct.connection = await voiceChannel.join();
			play(msg.guild, queueConstruct.songs[0]);
		} catch (e) {
			console.error(`Could not join ${e}`);
			queue.delete(msg.guild.id);
		}
	} else {
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return msg.channel.send(`${song.title} has been added to the queue`);
	}
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('song ended');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.log(error));
	dispatcher.setVolumeLogarithmic(5 / 5);

	serverQueue.textChannel.send(song.title);
}
