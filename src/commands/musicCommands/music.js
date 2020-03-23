const { Util } = require('discord.js');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_KEY); //API KEY DO NOT COMMIT!!!!
const queue = new Map();

module.exports = async msg => {
	const serverQueue = queue.get(msg.guild.id);
	if (msg.content.includes('play')) {
		const args = msg.content.split(' ');
		let url = args[1].replace(/<(.+)>/g, '$1');
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
		if (url.includes('playlist?list=')) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			msg.channel.send(`Playlist: ${playlist.title} has been added`);
			try {
				for (const video of Object.values(videos)) {
					const video2 = await youtube.getVideoByID(video.id);
					await handleVideo(video2, msg, voiceChannel, true);
				}
			} catch (err) {
				return console.log(`Theres a private video: ${err}`);
			}
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (err) {
				try {
					var videos = await youtube.searchVideos(searchString, 1);
					video = await youtube.getVideoByID(videos[0].id);
				} catch (err) {
					console.log(err);
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	}

	if (msg.content.includes('shuffle')) {
		trueShuffle(serverQueue.songs);
		return serverQueue.songs;
	} else if (msg.content.includes('skip')) {
		if (!serverQueue) return msg.channel.send('There is nothing playing');
		serverQueue.connection.dispatcher.end();
		return undefined;
	} else if (msg.content.includes('stop')) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel');
		if (serverQueue.songs === undefined) return;
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
		return msg.channel.send('Stopped music');
	} else if (msg.content.includes('np')) {
		if (!serverQueue) return msg.channel.send('There is nothing playing');
		return msg.channel.send(`Now playing: ${serverQueue.songs[0].title} `);
	}
	if (msg.content.includes('queue')) {
		if (!serverQueue) return msg.channel.send('There is nothing playing');
		return msg.channel.send(`
			__**The Queue**__
${serverQueue.songs.map(song => `${song.title}`).join('\n')}
			
			__**Current song**__${serverQueue.songs[0].title};
			`);
	} else if (msg.content.includes('pause')) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('The song is paused');
		}
		return msg.channel.send('There is nothing playing');
	} else if (msg.content.includes('resume')) {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('The song is resumed');
		}
		return msg.channel.send('There is nothing playing');
	}
};

function trueShuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	try {
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
	} catch (err) {
		console.log(err);
	}
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);
	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	const dispatcher = serverQueue.connection.playStream(ytdl(song.url, { highWaterMark: 32000 }), { bitrate: 192000 })
		.on('end', () => {
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.log(error));
	dispatcher.setVolumeLogarithmic(5 / 5);
	serverQueue.textChannel.send(song.title);
}
