const Discord = require('discord.js');
const config = require("./conf/config.json");
const client = new Discord.Client();
const mine = require("./commands/mine.js");
const shop = require("./commands/shop.js");
const profile = require("./commands/profile.js");
const commands = require("./commands/commands.js");
// Command Init
let mineCMD = ["m", "mine", "am", "automine", "s", "shop", "p", "profile", "i", "info", "cmds", "commands", "repair", "r", "start", "s"];
let mineFUNCS = [mine.mine, mine.mine, mine.automine, mine.automine, shop.shop, shop.shop, profile.profile, profile.profile, profile.info, profile.info, commands.list, commands.list, mine.repair, mine.repair, mine.start, mine.start];
// Bot Init
client.on('ready', () => { console.log(`Lets Mine as ${client.user.tag} today!`);
var Aguild =  function(){guild = client.guilds.get("544749577790554113");console.log(guild);return guild;} });
// Message Handling
client.on('message', msg => {
        if (msg.channel.id == config.botchannel){ // checking the command was sent in the right channel
            let cmd = msg.content.split("!"); // splitting message into a array for processing //
            let authrole = msg.member.roles.last(1);
            let color = authrole[0].hexColor;
            cmd.shift()
                for (let i = 0; i < mineCMD.length; i++) { // command selector
                    if (cmd[0] === mineCMD[i]) {
                      mineFUNCS[i](msg, color, client, cmd);}}}
        return;
});
client.login(config.token);