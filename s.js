const Discord = require('discord.js'); // Подключаем библиотеку discord.js
const request = require("request");
const {Client, Intents} = require('discord.js')
const robot = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING], ws: { properties: { $browser: "Discord iOS" }} }); // Объявляем, что robot - бот
const fs = require('fs'); // Подключаем родной модуль файловой системы node.js  
let config = require('./config.json'); // Подключаем файл с параметрами и информацией
let token = config.token; // «Вытаскиваем» из него токен
let prefix = config.prefix; // «Вытаскиваем» из него префикс


robot.on("ready",  async () => {
  console.log(await robot.application.commands.create({
    name: "gdstats",
    description: "Статистика Geometry Dash",
    options: [{
          "name": "player",
              "description": "Статистика игрока",
              "type": 1,
              "required": false,
              "options": [{name: 'name', type: 3, description: 'Игровое имя или айди', required: true}]
        },
         {"name": "level",
        "description": "Статистика уровня",
        "type": 1,
        "required": false,
        "options": [{name: 'id', type: 3, description: 'Айди уровня', required: true}]
      }]}));
})
  robot.login(token);

  //лаунчер слеш команд если мы будем делать их в будущем