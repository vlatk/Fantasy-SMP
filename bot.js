const Discord = require('discord.js'); // Подключаем библиотеку discord.js
const request = require("request");
const {Intents} = require('discord.js')
const {Client} = require('discord.js') //строка снизу запускает и авторизует бота
const robot = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING], allowedMentions: { parse: ['users', 'roles']}}); // Объявляем, что robot - бот
const fs = require('fs'); // Подключаем родной модуль файловой системы node.js  
let config = require('./config.json'); // Подключаем файл с параметрами и информацией
let token = config.token; // «Вытаскиваем» из него токен
let prefix = config.prefix; // «Вытаскиваем» из него префикс


robot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Загрузка команды ${commandName}..`);
    robot.commands.set(commandName, props);
  });
});//обработчик обычных команд

robot.slashs = new Discord.Collection();

fs.readdir("./slashs/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./slashs/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Загрузка слеш-команды ${commandName}..`);
    robot.slashs.set(commandName, props);
  });
});//обработчик слеш команд

robot.intersss = new Discord.Collection();

fs.readdir("./interactions/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./interactions/${file}`);
    let commandName = file.split(".")[0];
    robot.intersss.set(commandName, props);
  });
});//обработчик интеракций (загугли) команд

robot.on("ready", function() {
  /* При успешном запуске, в консоли появится сообщение «[Имя бота] запустился!» */
  console.log(robot.user.username + " запустился!");

  setInterval(function(){
    request({url: `https://api.trademc.org/shop.getOnline?shop=162663&v=3`, headers: {"Content-Type": "application/json"}}, (err, res, body) => {
      var result = JSON.parse(body);
      robot.user.setPresence({status: 'online',  activities: [{ name: `${result.response.players} из ${result.response.max_players} онлайн    , версия: ${result.response.version}`, type: "STREAMING", url: "https://www.twitch.tv/MisterRogerChannel"}]})
    })
}, 5000)//запрашиваем кол-во нынешних игроков, макс игроков и версию и ставим ее в качестве статуса (дествие повторяется каждые 5 сек)

})



robot.on('messageCreate', (msg) => { // Реагирование на сообщения
  if (msg.author.id == robot.user.id) return; //Если сообщение отправил бот - игнорируем.

    const args = msg.content.slice(prefix.length).trim().split(/ +/g); //аргументы
    const command = args.shift().toLowerCase(); //команда

    if (msg.content.indexOf(prefix) !== 0) return; //Делаем проверку на префикс (взято из моего кода)

    var commfile = robot.commands.get(command); //получаем файл команды
try{
    
if(commfile) commfile.run(robot, msg, args); //Если команда существует, запускаем.
}catch(err){console.log(err)}
});//запуск файла команд

robot.on('interactionCreate', (interaction) => { 
var commfile = robot.slashs.get(interaction.commandName);
try{
  if(commfile) commfile.run(robot, interaction);
}catch(err){console.log(err)}
})//запуск файла слеш команд

robot.on('interactionCreate', (interaction) => { 
    if(interaction.customId){
      var commfile = robot.intersss.get(interaction.customId); 
try{
      if(commfile) commfile.run(robot, interaction);}catch(err){console.log(err)}
}//запуск файла интеракций 
})




robot.login(token); // Авторизация бота