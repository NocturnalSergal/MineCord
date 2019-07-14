const getEmoji = require('../conf/emojis.json');
const { Client, RichEmbed } = require('discord.js');
const config = require("../conf/config.json");
const db = require('../MineCord.js');
var fs = require('fs');
const talkedRecently = new Set();


function mine(msg, color){
    if (talkedRecently.has(msg.author.id)) {
        reply = new RichEmbed()
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setColor(color)
            .addField("Error" , "**Wait a couple seconds before mining again**");
        msg.channel.send(reply);
        return;
    }
    try {
        if (fs.existsSync(`storage/${msg.author.id}.json`)) {
            let pick, minedres, mined, reply;
            mined = Math.round(Math.random() * (10 - 2) + 2);
            fs.readFile(`storage/${msg.author.id}.json`, function(err, fx){
                arrayUser = JSON.parse(fx.toString('utf8'));
                if (parseInt(arrayUser.uses) < 1){
                    reply = new RichEmbed()
                        .setAuthor(msg.author.username, msg.author.avatarURL)
                        .setColor(color)
                        .addField("Error" , "**Your Pickaxe is broken, repair it using `m!repair`.**");
                    msg.channel.send(reply);
                    return;
                }
                arrayUser.uses = parseInt(arrayUser.uses) - 1;
                pick = arrayUser.pick;
                stonemined = parseInt(Math.round(config[pick].efficency * mined));
                coalmined = parseInt((Math.round(config[pick].efficency * mined * .4)));
                arrayUser.stone = parseInt(arrayUser.stone) + stonemined;
                arrayUser.coal = parseInt(arrayUser.coal) + coalmined;
                arrayUser.xp = parseInt(arrayUser.xp) + mined; 
                minedres = config.Estone + stonemined + " ** Stone **" + "\n" + config.Ecoal + coalmined + " ** Coal **" + "\n";
                if (pick === "stonepick" || pick === "ironpick" || pick === "goldpick" || pick === "diamondpick" || pick === "obsidianpick"){
                    ironmined = parseInt((Math.round(config[pick].efficency * mined * .5)));
                    redstonemined = parseInt((Math.round(config[pick].efficency * mined * .34)));
                    arrayUser.iron = parseInt(arrayUser.iron) + ironmined;
                    arrayUser.redstone = parseInt(arrayUser.redstone) + redstonemined;
                    minedres = minedres + config.Eiron + ironmined + "** Iron **" + "\n" + config.Eredstone + redstonemined + "** Redstone **" + "\n";
                }
                if (pick === "ironpick" || pick === "goldpick" || pick === "diamondpick" || pick === "obsidianpick"){
                    goldmined = parseInt((Math.round(config[pick].efficency * mined * .3)));
                    arrayUser.gold = parseInt(arrayUser.gold) + goldmined;
                    minedres = minedres + config.Egold + goldmined + "** Gold **" + "\n";
                }
                if (pick === "goldpick" || pick === "diamondpick" || pick === "obsidianpick"){
                    diamondmined = parseInt((Math.round(config[pick].efficency * mined * .2)));
                    emeraldmined = parseInt((Math.round(config[pick].efficency * mined * .1)));
                    arrayUser.diamond = parseInt(arrayUser.diamond) + diamondmined;
                    arrayUser.emerald = parseInt(arrayUser.emerald) + emeraldmined;
                    minedres = minedres + config.Ediamond + diamondmined + "** Diamonds **" + "\n " + config.Eemerald + emeraldmined + "** Emeralds **" + "\n";
                }
                if (pick === "diamondpick" || pick === "obsidianpick"){
                    obsidianmined = parseInt((Math.round(config[pick].efficency * mined * .175)));
                    arrayUser.obsidian = parseInt(arrayUser.obsidian) + obsidianmined;
                    minedres = minedres + config.Eobsidian + obsidianmined + "** Obsidian **" + "\n"
                }
                if (parseInt(arrayUser.xp) >= parseInt(arrayUser.xplevelup)){
                    arrayUser.xplevelup = Math.round(((parseInt(arrayUser.xplevelup) + parseInt(arrayUser.xplevelup)) * .10) + (parseInt(arrayUser.xplevelup) + parseInt(arrayUser.xplevelup)));
                    arrayUser.xp = 0;
                    arrayUser.level = parseInt(arrayUser.level) + 1;
                    arrayUser.emerald = parseInt(arrayUser.emerald) + parseInt(arrayUser.level);
                    reply = new RichEmbed()
                        .setAuthor(msg.author.username, msg.author.avatarURL)
                        .setColor(color)
                        .addField("**Congradulations**", "You Leveled up! You are now Level `" + arrayUser.level +"` \n" + "**You may have unlocked something new check the shop!**" + "\n" + `You have gained ${arrayUser.level} Emeralds` + config.Eemerald);
                    msg.channel.send(reply);
                }
                stringUser = JSON.stringify(arrayUser);
                fs.writeFile(`storage/${msg.author.id}.json`, stringUser, function(err){
                    if (err) throw err;
                });
                reply = new RichEmbed()
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setColor(color)
                    .addField("**You Mined**", minedres)
                    .addField("**With your**", config[pick].emoji + " " + "**" + config[pick].pickname + "**"); 
                msg.channel.send(reply);
                talkedRecently.add(msg.author.id);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    talkedRecently.delete(msg.author.id);
                    }, 5000);
                return;
            });
        }
    } 
    catch(err) {
        console.error(err)
        reply = new RichEmbed()
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setColor(color.hexColor)
            .addField("Error" , "**You Don't have a pickaxe yet do `m!start` to get your first pickaxe.**");
        msg.channel.send(reply);
        return;
    }
}

function start(msg, color){
    fs.readFile(`storage/${msg.author.id}.json` ,function(err, arrayUser) {
        if (arrayUser == null){
            arrayUser = `{"id": "${msg.author.id}","balance": "0","pick": "woodpick","stone": "0","coal": "0","iron": "0","gold": "0","redstone": "0","diamond": "0","emerald": "0","obsidian": "0","uses": "0","xp": "0","xplevelup": "64", "level": "1", "uses": "256"}`
            fs.writeFile(`storage/${msg.author.id}.json`, arrayUser, function(err){
                if (err) throw err;
            });
            reply = new RichEmbed()
                .setAuthor(msg.author.username, msg.author.avatarURL)
                .setColor(color.hexColor)
                .addField("**Sucess**", "**You may now start mining with your **" + config["woodpick"].emoji + "** Wooden Pickaxe.**"); 
            msg.channel.send(reply);
        
        }
    });
}

function automine(msg, cmd){
    let pick = "stonepick";
    console.log(config[pick]);
    return;
}

function repair(msg, color){
    fs.exists(`storage/${msg.author.id}.json`, function(exists){
        if (exists == true) {
            fs.readFile(`storage/${msg.author.id}.json`, function(err, fx){
                let arrayUser = JSON.parse(fx.toString('utf8'));
                let pick = arrayUser.pick;
                let repairmaterial = config[pick].material;
                let percentused = Math.abs((((parseInt(arrayUser.uses) / parseInt(config[pick].maxuses)) * 100) - 100) / 100);
                let repaircost
                if (isNaN(percentused)){
                    repaircost = parseInt(config[pick].baserepair);
                }
                else{
                    repaircost = Math.round(parseInt(config[pick].baserepair) * percentused);
                }
                if (parseInt(arrayUser[repairmaterial]) < repaircost){
                    let fail = "**You Do Not have** " + "**" + repaircost + "**" + " " + config[pick].memoji + " **" + config[pick].material + " avalible" + "\n" + "to repair your ** " + config[pick].emoji + " **" + config[pick].pickname + " **"; 
                    let reply = new RichEmbed()
                        .setAuthor(msg.author.username, msg.author.avatarURL)
                        .setColor(color)
                        .addField("**Repair Failed**", fail); 
                    msg.channel.send(reply);
                    return;
                }
                if (parseInt(arrayUser[repairmaterial]) > repaircost){
                    arrayUser[repairmaterial] = parseInt(arrayUser[repairmaterial]) - repaircost;
                    arrayUser.uses = config[pick].maxuses;
                    stringUser = JSON.stringify(arrayUser);
                    fs.writeFile(`storage/${msg.author.id}.json`, stringUser, function(err){
                        if (err) throw err;
                    });
                    let confirmation = "**You have sucessfully repaired your ** " + config[pick].emoji + " **" + config[pick].pickname + "**"
                    let reply = new RichEmbed()
                        .setAuthor(msg.author.username, msg.author.avatarURL)
                        .setColor(color)
                        .addField("**Repaired**", confirmation); 
                    msg.channel.send(reply);
                    return;
                }
            });
        }
    });

}

exports.mine = mine;
exports.automine = automine;
exports.repair = repair;
exports.start = start;