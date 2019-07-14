
const { client, RichEmbed } = require('discord.js');
const config = require("../conf/config.json");
var fs = require('fs');

function profile(msg, color){
  fs.exists(`storage/${msg.author.id}.json`, function(exists){
    if (exists == true) {
      fs.readFile(`storage/${msg.author.id}.json`, function(err, fx){
        arrayUser = JSON.parse(fx.toString('utf8'));
        let pick = arrayUser.pick;
        let Durability = arrayUser.uses;
        let Level = arrayUser.level;
        let XP = arrayUser.xp;
        let XPlevelup = arrayUser.xplevelup;
        let Money = arrayUser.balance;
        let Stone = arrayUser.stone;
        let Coal = arrayUser.coal;
        let Iron = arrayUser.iron;
        let Gold = arrayUser.gold;
        let Redstone = arrayUser.redstone;
        let Diamonds = arrayUser.diamond;
        let Emeralds = arrayUser.emerald;
        let Obsidian = arrayUser.obsidian;
        let maxuses = config[arrayUser.pick].maxuses;
        let reply = new RichEmbed()
          .setAuthor(msg.author.username, msg.author.avatarURL)
          .setColor(color)
          .addField("**Information**","**Pickaxe:**" + config[pick].emoji + "\n" + "**Durability:** " + Durability + " / " + maxuses + "\n" + "**Level:** " + Level + "\n" + "**Money:** $" + Money + "\n" + "**XP:** " + XP + " / " + XPlevelup,  true)
          .addField("**Inventory**", "**Stone:** " + Stone + config.Estone + "\n" + "**Coal**: " + Coal + config.Ecoal + "\n" + "**Iron:** " + Iron + config.Eiron + "\n" + "**Gold:** " + Gold + config.Egold + "\n" + "**Redstone:** " + Redstone + config.Eredstone + "\n" + "**Diamonds:** " + Diamonds + config.Ediamond + "\n" + "**Emeralds:** " + Emeralds + config.Eemerald + "\n" + "**Obsidian:**" + Obsidian + config.Eobsidian ,true);
        msg.channel.send(reply);
        return;
        });
      }
    if(exists == false) {
      reply = new RichEmbed()
          .setAuthor(msg.author.username, msg.author.avatarURL)
          .setColor(color)
          .addField("Error" , "**You Don't have a profile yet do `m!start` to create your profile.**");
      msg.channel.send(reply);
      return;
    }
  });
}
function info(msg, cmd){

}

exports.info = info;
exports.profile = profile;