const { Client, RichEmbed } = require('discord.js');
const config = require("../conf/config.json");
const mysql      = require('mysql');
const con = mysql.createConnection({
  host     : config.mysqlHost,
  user     : config.mysqlUser,
  password : config.mysqlPassword,
  database : config.mysqlDatabase
});

function shop(msg, cmd){
  
    return;
}

exports.shop = shop;