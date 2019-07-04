const client = require('discord.js');
const guild = require('../assets/guild.js');
const getEmoji = require('../conf/emojis.json');
const { Client, RichEmbed } = require('discord.js');
const config = require("../conf/config.json");
const db = require('../main.js');
const mysql      = require('mysql');
const talkedRecently = new Set();



function mine(msg, cmd, client){
    authrole = msg.member.roles.last(1);


    if (talkedRecently.has(msg.author.id)) {
        reply = new RichEmbed()
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setColor(authrole[0].hexColor)
            .addField("Error" , "**Wait a couple seconds before mining again**");
        msg.channel.send(reply);
        return;
} else {

    let pickaxe , authrole , pick , minedres , mined , reply, sql;
    let stonemined, coalmined, ironmined, goldmined, diamondmined, obsidianmined, redstonemined, emeraldmined = 0;
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
            if (res[0].uses <= 0){
                reply = new RichEmbed()
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setColor(authrole[0].hexColor)
                    .addField("Error" , "**Your pickaxe is broken do `m!repair` to repair your pickaxe, or wait for it to fix its self.**");
                msg.channel.send(reply);
                con.release();
                return;
            }
            pick = res[0].pick;
            stonemined = parseInt(Math.round(config[pick].efficency * mined));
            coalmined = parseInt((Math.round(config[pick].efficency * mined * .4)));
            redstonemined = parseInt((Math.round(config[pick].efficency * mined * .34)));
            sql = `update users set stone = stone + ${stonemined}, coal = coal + ${coalmined}, redstone = redstone + ${redstonemined}, uses = uses - 1`
            minedres = config.Estone + stonemined + " ** Stone **" + "\n" + config.Ecoal + coalmined + " ** Coal **" + "\n" + config.Eredstone + redstonemined + "** Redstone **" + "\n";
            if (pick === "stonepick" || pick === "ironpick" || pick === "goldpick" || pick === "diamondpick" || pick === "obsidianpick"){
                ironmined = parseInt((Math.round(config[pick].efficency * mined * .5)));
                sql += `, iron = iron + ${ironmined}`;
                minedres = minedres + config.Eiron + ironmined + "** Iron **" + "\n";
            }
            if (pick === "ironpick" || pick === "goldpick" || pick === "diamondpick" || pick === "obsidianpick"){
                goldmined = parseInt((Math.round(config[pick].efficency * mined * .3)));
                sql += `, gold = gold + ${goldmined}`;
                minedres = minedres + config.Egold + goldmined + "** Gold **" + "\n";
            }
            if (pick === "goldpick" || pick === "diamondpick" || pick === "obsidianpick"){
                diamondmined = parseInt((Math.round(config[pick].efficency * mined * .2)));
                emeraldmined = parseInt((Math.round(config[pick].efficency * mined * .1)));
                sql += `, diamond = diamond + ${diamondmined}, emerald = emerald + ${emeraldmined}`;
                minedres = minedres + config.Ediamond + diamondmined + "** Diamonds **" + "\n " + config.Eemerald + emeraldmined + "** Emeralds **" + "\n";
            }
            if (pick === "diamondpick" || pick === "obsidianpick"){
                obsidianmined = parseInt((Math.round(config[pick].efficency * mined * .175)));
                sql += `, obsidian = obsidian + ${obsidianmined}`;
                minedres = minedres + config.Eobsidian + obsidianmined + "** Obsidian **" + "\n"
            }
            sql += ` where id = ${msg.author.id}`
            con.query(sql);
            reply = new RichEmbed()
                .setAuthor(msg.author.username, msg.author.avatarURL)
                .setColor(authrole[0].hexColor)
                .addField("**You Mined**", minedres)
                .addField("**With your**", config[pick].emoji + " " + "**" + config[pick].pickname + "**"); 
            msg.channel.send(reply);
            con.release();
            // Adds the user to the set so that they can't talk for a minute
        talkedRecently.add(msg.author.id);
        setTimeout(() => {
            // Removes the user from the set after a minute
        talkedRecently.delete(msg.author.id);
        }, 5000);
            return;
        });
    });

    
}

}

function start(msg, cmd, client){
    let authrole = msg.member.roles.last(1);
    db.pool.getConnection(function(err, con){
        con.query(`select * from users where id = ${msg.author.id}` , function(err, res){
            if (res[0] == null){
                con.query(`INSERT INTO Economy.users (id,balance,pick,stone,coal,iron,gold,diamond,emerald,redstone,uses,level,xp,maxuses,obsidian)
                VALUES ('${msg.author.id}','0','woodpick','0','0','0','0','0','0','0','256','1','0','256','0');`);
                reply = new RichEmbed()
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setColor(authrole[0].hexColor)
                    .addField("**Sucess**", "**You may now begin to mine with your " + config["woodpick"].emoji + config["woodpick"].pickname + "**");
                msg.channel.send(reply);
                con.release();
                return;



                
            }
            else{
                reply = new RichEmbed()
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setColor(authrole[0].hexColor)
                    .addField("**Failure**", "**You already have a pickaxe.**");
                msg.channel.send(reply);
                con.release();
                console.log("You have an account");
                return;
            }
        });
    });
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
exports.start = start;