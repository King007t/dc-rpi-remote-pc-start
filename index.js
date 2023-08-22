const discord = require("discord.js");
const fs = require("fs");
var cp = require('child_process');
var client = new discord.Client({
	intents: ["GUILDS", "GUILD_MESSAGES"]
});

//variables
var prefix = "";
var token = "";
var globalsec = "";
var required_role = "";
var channelid = "";

//Load config
var config = require("./config.json");
loadconfig();

client.on("ready", () => {

	console.log("Bot ready");
});

client.on("messageCreate", (msg) => {

	if (msg.author.bot || !msg.content.startsWith(prefix)) {
		return;
	}

	var args = [];
	var command = msg.content.toLowerCase().substring(prefix.length);
	args = command.split(" ");

	msg.delete();

	// ------------------------

	if (args[0] == "setchannel") {

		if (!msg.member.permissions.has('ADMINISTRATOR')) {
			sendMessage(msg.channel, `You dont have the permission to use this command. Use \`\`${prefix}help\`\` for available commands or ask a Staff member for help`, globalsec);
			return;
		}

		if (args.length != 1) {
			sendMessage(msg.channel, `This command functions without arguments. Please use \`\`${prefix}help\`\``, globalsec);
			return;
		}

		if(config.channel == msg.channel.id) {
			sendMessage(msg.channel, `Channel is already set to ` + msg.channel.name, globalsec);
		}

		else {
			config.channel = msg.channel.id;
			channelid = msg.channel.id;
			save(__dirname + "/config.json", config);

			sendMessage(msg.channel, `Set channel to ` + msg.channel.name + " :speech_left:", globalsec);
		}
		return;
	}

	// ------------------------

	if (msg.channel.id != channelid) {
		sendMessage(msg.channel, `Please use the correct channel.`, globalsec);
		return;
	}

	switch (args[0]) {

		case ("help"):
		
			if (required_role.use && !msg.member.roles.cache.find(role => role.name === required_role.name)) {
				sendMessage(msg.channel, `Sorry, you don't have the right privileges. You can ask a Staff member for help.`, globalsec);
				return;
			}

			if (args.length != 1) {
				sendMessage(msg.channel, `This command functions without arguments. Please use \`\`${prefix}help\`\``, globalsec);
				return;
			}

			if (args.length != 1) {
				sendMessage(msg.channel, `This command functions without arguments. Please use \`\`${prefix}help\`\``, globalsec);
				return;
			}

			var help = `**__USABLE COMMANDS__**\n1. \`\`${prefix}post\`\`\n2. \`\`${prefix}reboot\`\`\n3. \`\`${prefix}shutdown\`\`\n4. \`\`${prefix}status\`\``;

			if (msg.member.permissions.has("ADMINISTRATOR")) {
				help += `\n\n**__COMMANDS FOR ADMINISTRATOR__**\n1. \`\`${prefix}force-shutdown\`\`\n2. \`\`${prefix}setchannel\`\`\n3. \`\`${prefix}reload\`\``;
			}

			sendMessage(msg.channel, help, globalsec * 2);
		break;

		case ("status"):
			
			
		
			if (required_role.use && !msg.member.roles.cache.find(role => role.name === required_role.name)) {
				sendMessage(msg.channel, `Sorry, you don't have the right privileges. You can ask a Staff member for help.`, globalsec);
				return;
			}

			if (args.length != 1) {
				sendMessage(msg.channel, `This command functions without arguments. Please use \`\`${prefix}help\`\``, globalsec);
				return;
			}

			sendMessage(msg.channel, "The Server is currently " + (config.status == "on" ? "online :white_check_mark:" : "offline :octagonal_sign:"), globalsec);
		break;

		case ("post"):

			if (required_role.use && !msg.member.roles.cache.find(role => role.name === required_role.name)) {
				sendMessage(msg.channel, `Sorry, you don't have the right privileges. Use \`\`${prefix}help\`\` for available commands`, globalsec);
				return;
			}

			if (args.length != 1) {
				sendMessage(msg.channel, `This command functions without arguments. Please use \`\`${prefix}help\`\``, globalsec);
				return;
			}

			if (config.status == "on") {
				sendMessage(msg.channel, `The server is already up and running. :white_check_mark:`, globalsec);
				return;
			}

			cp.exec(__dirname + "/shellscripts/post.sh", function(err, stdout, stderr) => {
				console.log(stdout);
				console.log(stderr);

				if (err != null) {
					sendMessage(msg.channel, `An error occured :exclamation: \n\`\`${err}\`\``, globalsec * 2);
					return;
				}
			});

			config.status = "on";
			save(__dirname + "/config.json", config);
			sendMessage(msg.channel, `The server is posting now. :white_check_mark:`, globalsec);
		break;

		case ("reboot"):

			if (required_role.use && !msg.member.roles.cache.find(role => role.name === required_role.name)) {
				sendMessage(msg.channel, `Sorry, you don't have the right privileges. Use \`\`${prefix}help\`\` for available commands`, globalsec);
				return;
			}

			if (args.length != 1) {
				sendMessage(msg.channel, `This command functions without arguments. Please use \`\`${prefix}help\`\``, globalsec);
				return;
			}

			if (config.status == "off") {
				sendMessage(msg.channel, `The server is shut down. Use \`\`${prefix}post\`\` instead. :octagonal_sign:`, globalsec);
				return;
			}

			cp.exec(__dirname + "/shellscripts/reboot.sh", function(err, stdout, stderr) => {
				console.log(stdout);
				console.log(stderr);

				if (err != null) {
					sendMessage(msg.channel, `An error occured :exclamation: \n\`\`${err}\`\``, globalsec * 2);
					return;
				}
			});

			sendMessage(msg.channel, `The server is rebooting now. :recycle:`, globalsec);
		break;

		case ("shutdown"):

			if (required_role.use && !msg.member.roles.cache.find(role => role.name === required_role.name)) {
				sendMessage(msg.channel, `Sorry, you don't have the right privileges. Use \`\`${prefix}help\`\` for available commands`, globalsec);
				return;
			}

			if (args.length != 1) {
				sendMessage(msg.channel, `This command functions without arguments. Please use \`\`${prefix}help\`\``, globalsec);
				return;
			}

			if (config.status == "off") {
				sendMessage(msg.channel, `The server is already shut down. :octagonal_sign:`, globalsec);
				return;
			}

			cp.exec(__dirname + "/shellscripts/shutdown.sh", function(err, stdout, stderr) => {
				console.log(stdout);
				console.log(stderr);

				if (err != null) {
					sendMessage(msg.channel, `An error occured :exclamation: \n\`\`${err}\`\``, globalsec * 2);
					return;
				}
			});

			config.status = "off";
			save(__dirname + "/config.json", config);
			sendMessage(msg.channel, `The server is shutting down now. :octagonal_sign:`, globalsec);
		break;		

		case ("force-shutdown"):

			if (!msg.member.permissions.has('ADMINISTRATOR')) {
				sendMessage(msg.channel, `You dont have the permission to use this command. Use \`\`${prefix}help\`\` for available commands or ask a Staff member for help`, globalsec);
				return;
			}

			if (args.length != 1) {
				sendMessage(msg.channel, `This command functions without arguments. Please use \`\`${prefix}help\`\``, globalsec);
				return;
			}

			cp.exec(__dirname + "/shellscripts/force-shutdown.sh", function(err, stdout, stderr) => {
				console.log(stdout);
				console.log(stderr);

				if (err != null) {
					sendMessage(msg.channel, `An error occured :exclamation: \n\`\`${err}\`\``, globalsec * 2);
					return;
				}
			});

			config.status = "off";
			save(__dirname + "/config.json", config);
			sendMessage(msg.channel, `The server is being forced to shut down now. :octagonal_sign:`, globalsec);
		break;

		case ("reload"):

			if (!msg.member.permissions.has('ADMINISTRATOR')) {
				sendMessage(msg.channel, `You dont have the permission to use this command. Use \`\`${prefix}help\`\` for available commands or ask a Staff member for help`, globalsec);
				return;
			}

			if (args.length != 1) {
				sendMessage(msg.channel, `This command functions without arguments. Please use \`\`${prefix}reload\`\``, globalsec);
				return;
			}
		
			delete require.cache[require.resolve("./config.json")];
			config = require("./config.json");
			loadconfig();

			sendMessage(msg.channel, `The files have been reloaded. :recycle:`, globalsec);

			client.login(token);
		break;

		default:

			sendMessage(msg.channel, `No command found. Use \`\`${prefix}help\`\` for available commands`, globalsec);
		break;
	}
});

function save(fileName, obj) {

	var jsonContent = JSON.stringify(obj);
	fs.writeFile(fileName, jsonContent, 'utf8', function (err) {
		if (err) {
			console.log("An error occured while writing JSON Object to File.");
			return console.log(err);
		}
	});
}

function loadconfig() {

	prefix = config.prefix;
	token = config.token;
	globalsec = config.globalsec;
	channelid = config.channel;
	required_role = config.required_role;
}

async function sendMessage(c, text, sec) {

	c.send(text).then(msg => {
        	setTimeout(() => msg.delete(), sec * 1000);
        });
}

client.login(token);