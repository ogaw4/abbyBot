const snek = require('snekfetch');
const Command = require('../../main/command');
const Constants = require('../../main/const');
const Discord = require('discord.js');

module.exports = class FGOQuizCommand extends Command {
  constructor(main) {
    super(main, {
      name: "quiz",
      category: "Fate Grand Order",
      help: "Get a quiz of a random Servant in Fate Grand Order, you'll have 5 minutes to answer!",
      alias: ["q"]
    });
    this.quizStatus = {};
    this.cooldown = {};
    this.cdMessages = ["Not that fast!", "Give me a break...", "Haven't you played enough already?", "No spam!"];
  }
  run(message, args, prefix) {
    if (this.quizStatus[message.channel.id] || message.author.id != this.main.config.ownerID) {
      message.channel.send("Someone is playing already, please wait until it finishes before starting a new one, okay?");
      return;
    }

    let time = this.cooldown[message.author.id] - message.createdTimestamp + 30000;
    if (time > 0 && message.author.id != this.main.config.ownerID) {
     let cdMess = this.main.util.ARand(this.cdMessages);
     if (this.main.util.rand(0, 1)) {
       message.channel.send(`${cdMess} You can only use this command once every 30 seconds. Please wait for ${Math.ceil(time / 1000) % 60} seconds to try again.`, 
        {file: {attachment: `${Constants.db}images/abbystop.png`, name: "stop.png"}});
      } else {
       message.channel.send(`${cdMess} You can only use this command once every 30 seconds. Please wait for ${Math.ceil(time / 1000) % 60} seconds to try again.`, 
        {file: {attachment: `${Constants.db}images/abbyno.png`, name: "stop.png"}});            
      }
    } else {
      this.cooldown[message.author.id] = message.createdTimestamp;
      snek.get(`${Constants.db}fgo_main.json`).then(r => {
        r = JSON.parse(r.text);
        let servantList = [];
        let result = {};
        for (let item in r) {
          servantList.push(r[item]);
        }
        if (Math.random() <= 0.5) {
          r = this.main.util.ARand(servantList);
          console.log(`[${new Date().toISOString().replace('T', ' ').substr(0, 19)}] ` + r.name);
          console.log(`[${new Date().toISOString().replace('T', ' ').substr(0, 19)}] ` + r.alias.join(', '));
          result = {
            title: "Which servant has this Noble Phantasm?",
            description: `\u200b\n${r.NP.split('\n').slice(0, 2).join('\n').replace(/\([^\)]+\) /g, '')}\n\n You have 5 minutes to answer, good luck!`
          }
        } else {
          do {
            r = this.main.util.ARand(servantList);
          } while (r.desc == "None");
          console.log(`[${new Date().toISOString().replace('T', ' ').substr(0, 19)}] ` + r.name);
          console.log(`[${new Date().toISOString().replace('T', ' ').substr(0, 19)}] ` + r.alias.join(', '));
          result = {
            title: "Which servant is this?",
            description: `\u200b\n${r.desc.replace(new RegExp(r.name, 'g'), '[REMOVED]')} You have 5 minutes to answer, good luck!`
          }
        }
        this.quizStatus[message.channel.id] = true;
        message.channel.send("", { embed: result }).then(() => {
          let collector = new Discord.MessageCollector(message.channel, m => true, {
            time: 300000
          });

          let quiz_init_owner = message.member.id;


          let aliases = r.alias.map(function(itm) { return itm.toLowerCase(); });

          collector.on('collect', (m, collector) => {
            if (this.quizStatus[message.channel.id]) {
              if (aliases.indexOf(m.content.toLowerCase()) > -1) {
                let guild = message.guild;
                let right = guild.emojis.find("name", "AbbySmile");
                message.channel.send(`${right} **Congratulations ${m.author}!** ${right}\nThe right answer is **${r.name}**!`);
                this.quizStatus[message.channel.id] = 0;
                collector.stop();
                if (global.gc) { global.gc(); }
              } else if (m.content.toLowerCase() == "stoppu" && (m.member.hasPermission('MANAGE_GUILD') || m.member.id == quiz_init_owner)) {
                let guild = message.guild;
                let right = guild.emojis.find("name", "AbbyStronk");
                message.channel.send(`Quiz aborted! ${right}`);
                this.quizStatus[message.channel.id] = 0;
                collector.stop();
                if (global.gc) { global.gc(); }
              } else {
                m.react("457576115381469195");
              }
            }
          });

          collector.on('end', (collected, reason) => {
            if (this.quizStatus[message.channel.id]) {
              let guild = message.guild;
              let thonk = guild.emojis.find("name", "AbbyThink");
              message.channel.send(`${thonk} 5 minutes have passed and no one got it right... The correct answer was **${r.name}**...`);
              this.quizStatus[message.channel.id] = 0;
            }
          });

          if (global.gc) { global.gc(); }

        });
      });
    }
  }
}