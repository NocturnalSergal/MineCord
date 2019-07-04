
const { client, RichEmbed } = require('discord.js');
const config = require("../conf/config.json");
const mysql      = require('mysql');
const con = mysql.createConnection({
  host     : config.mysqlHost,
  user     : config.mysqlUser,
  password : config.mysqlPassword,
  database : config.mysqlDatabase
});

function profile(msg, cmd, Eguild){
    let authrole = msg.member.roles.last(1);
    con.query(`SELECT * FROM users WHERE id = ${msg.author.id}` , function (err, res) {
       let Pickaxe = Eguild.emojis.find(emoji => emoji.name === res[0].pick);
       let Estone = Eguild.emojis.find(emoji => emoji.name === "stone");
       let Ecoal = Eguild.emojis.find(emoji => emoji.name === "coal");
       let Eiron = Eguild.emojis.find(emoji => emoji.name === "iron");
       let Egold = Eguild.emojis.find(emoji => emoji.name === "gold");
       let Eredstone = Eguild.emojis.find(emoji => emoji.name === "redstone");
       let Ediamond = Eguild.emojis.find(emoji => emoji.name === "diamond");
       let Eemerald = Eguild.emojis.find(emoji => emoji.name === "emerald");
       let Durability = res[0].uses;
       let Level = res[0].level;
       let XP = res[0].xp;
       let Money = res[0].balance;
       let Stone = res[0].stone;
       let Coal = res[0].coal;
       let Iron = res[0].iron;
       let Gold = res[0].gold;
       let Redstone = res[0].redstone;
       let Diamonds = res[0].diamond;
       let Emeralds = res[0].emerald;
       let maxuses = res[0].maxuses;
       let reply = new RichEmbed()
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setColor(authrole[0].hexColor)
            .addField("**Information**","**Pickaxe:**" + Pickaxe + "\n" + "**Durability:** " + Durability + " / " + maxuses + "\n" + "**Level:** " + Level + "\n" + "**Money:** $" + Money + "\n" + "**XP:** " + XP + " / ", true)
            .addField("**Inventory**", "**Stone:** " + Stone + Estone + "\n" + "**Coal**: " + Coal + Ecoal + "\n" + "**Iron:** " + Iron + Eiron + "\n" + "**Gold:** " + Gold + Egold + "\n" + "**Redstone:** " + Redstone + Eredstone + "\n" + "**Diamonds:** " + Diamonds + Ediamond + "\n" + "**Emeralds:** " + Emeralds + Eemerald ,true);
        msg.channel.send(reply);
        return;

    });

}

function info(msg, cmd){

}

exports.info = info;
exports.profile = profile;