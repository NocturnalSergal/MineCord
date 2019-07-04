const client = require('discord.js');
const guild = require('../assets/guild.js');
const getEmoji = require('../conf/emojis.json');
const { Client, RichEmbed } = require('discord.js');
const config = require("../conf/config.json");
const db = require('../main.js');
const mysql      = require('mysql');

function mine(msg, cmd, client){
    let pickaxe , authrole , pick , minedres , mined , reply , arraymined;
    arraymined = [];
    mined = Math.round(Math.random() * (10 - 2) + 2);
    authrole = msg.member.roles.last(1);
    db.pool.getConnection(function (err, con){
        con.query(`select * from users where id = ${msg.author.id}` , function(err, res){
            if (res[0] == null){
                reply = new RichEmbed()
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setColor(authrole[0].hexColor)
                    .addField("Error" , "**You Don't have a pickaxe yet do `m!start` to get your first pickaxe.**");
                msg.channel.send(reply);
                con.release();
                return;
            }
            pick = res[0].pick;
            if (res[0].uses <= 0){
                reply = new RichEmbed()
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setColor(authrole[0].hexColor)
                    .addField("Error" , "**Your pickaxe is broken do `m!repair` to repair your pickaxe, or wait for it to fix its self.**");
                msg.channel.send(reply);
                con.release();
                return;
            }
            mined +=

        });
    });
}

function oldmine(msg, cmd, client){
        let Pickaxe;
        let authrole = msg.member.roles.last(1);
        db.pool.getConnection(function(err, con){
        con.query(`SELECT * FROM users WHERE id = ${msg.author.id}` , function (err, res) {
            if (res[0] == null){
                msg.reply("fuck off william");
                return;
            }
            // Lets Mine !
            let pick = res[0].pick;
            let minedres;
            let pickname;
            // Getting Stone mined
            if (res[0].uses > 0 ){
            if (pick === "woodpick"){
                pickname = "Wooden Pickaxe";
                let mined = Math.round(Math.random() * (10 - 2) + 2);
                let stonemined = parseInt(Math.round(config[pick] * mined));
                let coalmined =  parseInt((Math.round(config[pick] * mined * .4)));
                let stoneup = stonemined +  parseInt(res[0].stone);
                let coalup = coalmined + parseInt(res[0].coal);
                con.query(`update users set stone = ${stoneup}, coal = ${coalup}, uses = uses - 1 where id = ${msg.author.id}`);
                minedres = getEmoji.Estone + stonemined + " **Stone**" + "\n" + getEmoji.Ecoal + coalmined + " **Coal**" + "\n";
                }
            if (pick === "stonepick"){
                pickname = "Stone Pickaxe";
                let mined = Math.round(Math.random() * (10 - 2) + 2);
                let stonemined = parseInt(Math.round(config[pick] * mined));
                let coalmined = parseInt((Math.round(config[pick] * mined * .7)));
                let ironmined = parseInt((Math.round(config[pick] * mined * .5)));
                let stoneup = stonemined +  parseInt(res[0].stone);
                let coalup = coalmined + parseInt(res[0].coal);
                let ironup = ironmined + parseInt(res[0].iron);
                con.query(`update users set stone = ${stoneup}, coal = ${coalup}, iron = ${ironup}, uses = uses - 1 where id = ${msg.author.id}`);
                minedres = getEmoji.Estone + stonemined + " **Stone**" + "\n" + getEmoji.Ecoal + coalmined + " **Coal**" + "\n" + getEmoji.Eiron + ironmined + " **Iron**" + "\n";
            }
            if (pick === "ironpick"){
                pickname = "Iron Pickaxe";
                let mined = Math.round(Math.random() * (10 - 2) + 2);
                let stonemined = parseInt(Math.round(config[pick] * mined));
                let coalmined = parseInt((Math.round(config[pick] * mined * .7)));
                let ironmined = parseInt((Math.round(config[pick] * mined * .5)));
                let goldmined = parseInt((Math.round(config[pick] * mined * .3)));
                let diamondmined = parseInt((Math.round(config[pick] * mined * .2)));
                let stoneup = stonemined +  parseInt(res[0].stone);
                let coalup = coalmined + parseInt(res[0].coal);
                let ironup = ironmined + parseInt(res[0].iron);
                let goldup = goldmined + parseInt(res[0].gold);
                let diamondup = diamondmined + parseInt(res[0].diamond);
                con.query(`update users set stone = ${stoneup}, coal = ${coalup}, iron = ${ironup}, gold = ${goldup}, diamond = ${diamondup}, uses = uses - 1 where id = ${msg.author.id}`);
                minedres = getEmoji.Estone + stonemined + " **Stone**" + "\n" + getEmoji.Ecoal + coalmined + " **Coal**" + "\n" + getEmoji.Eiron + ironmined + " **Iron**" + "\n" + getEmoji.Egold + goldmined + " **Gold**" + "\n" + getEmoji.Ediamond + diamondmined + " **Diamonds**" + "\n";
            }
            }
            else{
                 msg.reply("Your Pickaxe is broken.")
                }
            // Lets Parse and reply !
            Pickaxe = guild.Eguild(client).emojis.find(emoji => emoji.name === pick);
            let reply = new RichEmbed()
                .setAuthor(msg.author.username, msg.author.avatarURL)
                .setColor(authrole[0].hexColor)
                .addField("**You Mined**", minedres)
                .addField("**With your**", Pickaxe + " " + "**" + pickname + "**"); 
            msg.channel.send(reply);
            con.release();
         });
        });
        return;
    
}

function automine(msg, cmd){
    let pick = "stonepick";
    console.log(config[pick]);
    return;
}

function repair(msg, cmd, client){
    let authrole = msg.member.roles.last(1);
    db.pool.getConnection(function(err, con){
        con.query(`SELECT * FROM users WHERE id = ${msg.author.id}` , function (err, res) {
            let pickaxe = res[0].pick;
            let repairmaterial = config[pickaxe].material;
            let percentused = (parseInt(res[0].maxuses) / parseInt(res[0].uses)) - parseInt(1);
            let repaircost = Math.round(parseInt(config[pickaxe].baserepair) * percentused);
            if (res[0][repairmaterial] < repaircost){
                console.log(repaircost);
                let fail = "**You Do Not have** " + "**" + repaircost + "**" + " " + config[pickaxe].memoji + " **" + config[pickaxe].material + " avalible" + "\n" + "to repair your ** " + config[emoji] + " **" + config[pickaxe].pickname + " **"; 
                let reply = new RichEmbed()
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setColor(authrole[0].hexColor)
                    .addField("**Repair Failed**", fail) 
                msg.channel.send(reply);
                con.release();
                return;
             }
            if (res[0][repairmaterial] > repaircost){
                console.log(repaircost + "sucess");
                let confirmation = "**You have sucessfully repaired your** " + getEmoji.Ewoodpick
                con.release();
                return;
            }
        });
    });
}

exports.mine = mine;
exports.automine = automine;
exports.repair = repair;