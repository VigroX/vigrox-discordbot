const YouTube = require("simple-youtube-api");
const YTDL = require("ytdl-core");
const queue = new Map();
const yt = new YouTube(process.env.YOUTUBE_API_KEY);

exports.run = async (client, message, args) => {
	if(client.cjson.modules.yt.enabled === false) {
		return message.reply(":no_entry_sign: This module is disabled!");
	}
	const arg = message.content.split(" ");
	const searchString = arg.slice(2).join(" ");
	const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : '';
	const serverQueue = queue.get(message.guild.id);
	switch(args[0]) {
		case "play":
		const voiceChannel = message.member.voiceChannel;
		if(!voiceChannel) return message.channel.send("You must be in a voice channel!");
		if(!args[1]) return message.channel.send("Please provide a YT link!");
		const permissions = voiceChannel.permissionsFor(client.user);
		if(!permissions.has("CONNECT")) {
			return message.channel.send("I cannot connect to voice channel! (No permission.)");
		}
		if(!permissions.has("SPEAK")) {
			return message.channel.send("I cannot speak in voice channel! (No permission.)");
		}
		if(serverQueue && serverQueue.songs.length >= 500) {
			return message.channel.send("Sorry, but you have reached your max limit of songs.");
		}
		if(url.match(/youtu\.be\/([^&\n?#]+)/)) {
			const shortMatch = /youtu\.be\/([^&\n?#]+)/.exec(url);
			var video = await yt.getVideoByID(shortMatch[1]);
			await handleVideo(client, video, message, voiceChannel);
		} else if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			message.channel.send(":arrows_counterclockwise: Adding playlist songs...");
			const playlist = await yt.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await yt.getVideoByID(video.id);
				await handleVideo(client, video2, message, voiceChannel, true);
			}
			return message.channel.send(`:white_check_mark: Playlist: **${playlist.title}** has been added to the queue! (+${videos.length})`);
		} else {
			try {
				var video = await yt.getVideo(url);
			} catch(error) {
				try {
					var videos = await yt.searchVideos(searchString, 10);
					let index = 0;
					if(videos.length >= 1) {
						let embed = new client.discord.RichEmbed()
						.setColor("#ff3333")
						.setTitle("Song Selection: ")
						.setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join("\n")}\n\nPlease select a value or type \`cancel\``)
						.setTimestamp()
						.setFooter(`${client.user.username}`, `${client.user.avatarURL}`);
						message.channel.send({ embed: embed });
					} else {
						message.channel.send("No results found!");
					}
					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11 || message2.content.match(/^cancel$/i), {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch(err) {
						return message.channel.send('No invalid value entered, cancelling video selection.');
					}
					let firstResponse = response.first().content;
					if(firstResponse.match(/^cancel$/i)) return message.channel.send("Video selection canceled.");
					const videoIndex = parseInt(firstResponse);
					var video = await yt.getVideoByID(videos[videoIndex - 1].id);
				} catch(err) {
					console.error(err);
					return message.channel.send(":x: I couldn't obtain any search results.");
				}
			}
			await handleVideo(client, video, message, voiceChannel);
		}
		break;
		case "skip":
		if(!message.member.voiceChannel) return message.channel.send("You are not in a voice channel!");
		if(!serverQueue) return message.channel.send("There is nothing playing that I could skip for you!");
		serverQueue.textChannel.send(`:fast_forward: Skipped song!`);
		serverQueue.connection.dispatcher.end();
		break;
		case "stop":
		if(!message.member.voiceChannel) return message.channel.send("You are not in a voice channel!");
		if(!serverQueue) return message.channel.send("There is nothing playing that I could stop for you!");
		serverQueue.textChannel.send(`:negative_squared_cross_mark: Stop playing songs!`);
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
		break;
		case "np":
		if(!message.member.voiceChannel) return message.channel.send("You are not in a voice channel!");
		if(!serverQueue) return message.channel.send("There is nothing playing.");
		let song = serverQueue.songs[0];
		var secondslength = Math.log(song.durationS) * Math.LOG10E + 1 | 0;
		var mlength = Math.log(song.durationM) * Math.LOG10E + 1 | 0;
		if(song.durationH !== 0) {
			if(secondslength === 1 || secondslength === 0) {
				if(mlength === 1 || mlength === 0) {
					return serverQueue.textChannel.send(`:notes: Now playing: **${song.title}** (${song.durationH}:0${song.durationM}:0${song.durationS})`);
				}
			}
		}
		if(song.durationH !== 0) {
			if(secondslength === 1 || secondslength === 0) {
				if(mlength !== 1 || mlength !== 0) {
					return serverQueue.textChannel.send(`:notes: Now playing: **${song.title}** (${song.durationH}:${song.durationM}:0${song.durationS})`);
				}
			}
		}
		if(song.durationH !== 0) {
			if(mlength === 1 || mlength === 0) {
				if(secondslength !== 1 || secondslength !== 0) {
					return serverQueue.textChannel.send(`:notes: Now playing: **${song.title}** (${song.durationH}:0${song.durationM}:${song.durationS})`);
				}
			}
		}
		if(song.durationH !== 0) {
			if(mlength !== 1 || mlength !== 0) {
				if(secondslength !== 1 || secondslength !== 0) {
					return serverQueue.textChannel.send(`:notes: Now playing: **${song.title}** (${song.durationH}:${song.durationM}:${song.durationS})`);
				}
			}
		}
		if(song.durationH === 0 && song.durationM !== 0) {
			if(secondslength === 1 || secondslength === 0) {
				return serverQueue.textChannel.send(`:notes: Now playing: **${song.title}** (${song.durationM}:0${song.durationS})`);
			}
		}
		if(song.durationH === 0 && song.durationM !== 0) {
			if(secondslength !== 1 || secondslength !== 0) {
				return serverQueue.textChannel.send(`:notes: Now playing: **${song.title}** (${song.durationM}:${song.durationS})`);
			}
		}
		if(song.durationH === 0 && song.durationM === 0 && song.durationS !== 0) {
			return serverQueue.textChannel.send(`:notes: Now playing: **${song.title}** (${song.durationS} Seconds)`);
		} else {
			return serverQueue.textChannel.send(`:notes: Now playing: **${song.title}**`);
		}
		break;
		case "volume":
		if(!message.member.voiceChannel) return message.channel.send("You are not in a voice channel!");
		if(!serverQueue) return message.channel.send("There is nothing playing.");
		if(!args[1]) return message.channel.send(`:musical_note: The current volume is: **${serverQueue.volume}%**`);
		let volumeAmount = parseInt(args[1]);
		if(volumeAmount < 0 || volumeAmount > 200 || isNaN(volumeAmount)) {
			message.channel.send("Please set the volume to a value 0-200!");
		} else {
			if(volumeAmount === 0) {
				message.channel.send(`:mute: Volume set to: **${args[1]}%**`);
			} else if(volumeAmount > 100) {
				message.channel.send(`:loud_sound: Volume set to: **${args[1]}%**`);
			} else {
				message.channel.send(`:speaker: Volume set to: **${args[1]}%**`);
			}
			serverQueue.volume = args[1];
			serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100);
		}
		break;
		case "info":
		if(!message.member.voiceChannel) return message.channel.send("You are not in a voice channel!");
		if(!serverQueue) return message.channel.send("There is nothing playing.");
		let embedInfo;
		embedInfo = new client.discord.RichEmbed()
		.setColor("#ff3333")
		.setTitle("Info")
		.addField("Currently Playing", `${serverQueue.songs[0].title}`, false)
		.addField("Queued", `${serverQueue.songs.length}`, true)
		.addField("Playing", `${serverQueue.playing}`, true)
		.addField("Volume", `${serverQueue.volume}`, true)
		.addField("Loop", `${serverQueue.loop}`, true)
		.addField("URL", `${serverQueue.songs[0].url}`, true)
		.setTimestamp()
		.setFooter(`${client.user.username}`, `${client.user.avatarURL}`);
		return message.channel.send({ embed: embedInfo });
		break;
		case "queue":
		if(!message.member.voiceChannel) return message.channel.send("You are not in a voice channel!");
		if(!serverQueue) return message.channel.send("There is nothing playing!");
		let pageAmount = Math.ceil(serverQueue.songs.length / 15);
		let page = args[1] || 1;
		if(page > pageAmount || page < 1) page = 1;
		let embed;
		if(!serverQueue.loop) {
			embed = new client.discord.RichEmbed()
			.setColor("#ff3333")
			.setTitle(`Song Queue: (Page ${page}/${pageAmount}) `)
			.setDescription(serverQueue.songs.slice((page - 1) * 15, ((page - 1) * 15) + 15).map((song, i) => `**${((page - 1) * 15) + i + 1} -** ${song.title}`).join("\n"))
			.addField("Currently Playing: " + `${serverQueue.songs.length}`, `${serverQueue.songs[0].title}`)
			.setTimestamp()
			.setFooter(`${client.user.username}`, `${client.user.avatarURL}`);
		} else {
			embed = new client.discord.RichEmbed()
			.setColor("#ff3333")
			.setTitle(`Song Queue: (Page ${page}/${pageAmount}) `)
			.setDescription(serverQueue.songs.slice((page - 1) * 15, ((page - 1) * 15) + 15).map((song, i) => `**${((page - 1) * 15) + i + 1} -** ${song.title}`).join("\n"))
			.addField("Currently Looping: " + `${serverQueue.songs.length}`, `${serverQueue.songs[0].title}`)
			.setTimestamp()
			.setFooter(`${client.user.username}`, `${client.user.avatarURL}`);
		}
		message.channel.send({ embed: embed });
		break;
		case "pause":
		if(!message.member.voiceChannel) return message.channel.send("You are not in a voice channel!");
		if(serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send(":pause_button: Paused the music!");
		}
		message.channel.send(":x: There is nothing playing.");
		break;
		case "resume":
		if(!message.member.voiceChannel) return message.channel.send("You are not in a voice channel!");
		if(serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send(":arrow_forward: Resumed the music!");
		}
		message.channel.send(":x: There is nothing playing.");
		break;
		case "shuffle":
		if(!message.member.voiceChannel) return message.channel.send("You are not in a voice channel!");
		if(!serverQueue) return message.channel.send("There is nothing playing to shuffle!");
		let current = serverQueue.songs[0];
		let songs = serverQueue.songs;
		function shuffle(array) {
			var m = array.length, t, i;
			while (m > 0)
			{
				i = Math.floor(Math.random() * m--);
				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}
			return array;
		}
		songs.splice(0, 1);
		shuffle(songs);
		songs.splice(0, 0, current);
		serverQueue.songs = songs;
		message.channel.send(":repeat: **Shuffled** the queue.");
		break;
		case "loop":
		if(!message.member.voiceChannel) return message.channel.send("You are not in a voice channel!");
		if(!serverQueue) return message.channel.send("There is nothing playing to loop!");
		if(!serverQueue.loop) {
			serverQueue.loop = true;
			message.channel.send(`:repeat: **Queue** will now be looped.`);
		} else {
			serverQueue.loop = false;
			message.channel.send(`:repeat: **Queue** will no longer be looped.`);
		}
		break;
		case "playlist":
		if(!message.member.voiceChannel) return message.channel.send("You are not in a voice channel!");
		message.channel.send(":arrows_counterclockwise: Adding playlist songs...");
		let pl = await yt.getPlaylist(process.env.YT_PL);
		let plvideos = await pl.getVideos();
		for (const video of Object.values(plvideos)) {
			let video3 = await yt.getVideoByID(video.id);
			await handleVideo(client, video3, message, message.member.voiceChannel, true);
		}
		message.channel.send(`:white_check_mark: Playlist: **${pl.title}** has been added to the queue! (+${plvideos.length})`);
		break;
		default:
		message.channel.send(":question: Invalid usage. (play, skip, stop, np, playlist, info, loop, pause, resume, queue, volume)");
	}
};

async function handleVideo(client, video, message, voiceChannel, playlist = false) {
	const serverQueue = queue.get(message.guild.id);
	if(video == null && !playlist) {
		return message.channel.send("Invalid Link!");
	}
	const song = {
		id: video.id,
		title: client.discord.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`,
		durationH: video.duration.hours,
		durationM: video.duration.minutes,
		durationS: video.duration.seconds
	};
	if(!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 100,
			playing: true,
			loop: false
		};
		queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);
		try {
			message.channel.send(`:notes: Now playing: **${song.title}**`);
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch(error) {
			console.error(`Couldn't join the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`:no_entry: Couldn't join the voice channel! (ERROR)`);
		}
	} else {
		serverQueue.songs.push(song);
		if(playlist) return undefined;
		else return message.channel.send(`:white_check_mark: **${song.title}** has been added to the queue!`);
	}
	return;
};

function play(guild, song) {
	const serverQueue = queue.get(guild.id);
	if(!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return serverQueue.textChannel.send("Queue up some music!");
	}
	let Filter = song.durationH === 0 && song.durationM === 0 && song.durationS === 0 ? undefined : "audioonly";
	const streamOptions = { passes: 2, bitrate: "auto" };
	const dispatcher = serverQueue.connection.playStream(YTDL(song.url, {filter: Filter }), streamOptions)
	.on("end", async () => {
		if(serverQueue.loop === true) {
			let current = serverQueue.songs[0];
			let songs = serverQueue.songs;
			songs.splice(0, 1);
			songs.splice(0, 0, current);
			serverQueue.songs = songs;
			serverQueue.songs.push(current);
		}
		serverQueue.songs.shift();
		setTimeout(() => {
			play(guild, serverQueue.songs[0]);
		}, 250);
	})
	.on("error", err => console.error(err));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
};

exports.config = {
	name: "yt",
	aliases: ["youtube", "video", "vid", "audio"],
	usage: "yt <play|skip|stop|np|playlist|info|loop|pause|resume|queue|volume>",
	description: "Play the Audio from YouTube video.",
	accessableby: "Members"
};
