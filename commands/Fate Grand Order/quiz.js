const snek = require('snekfetch');
const Command = require('../../main/command');
const Constants = require('../../main/const');
const Discord = require('discord.js');

module.exports = class FGOQuizCommand extends Command {
  constructor(main) {
    super(main, {
      name: "quiz",
      category: "Fate Grand Order",
      help: "Get a quiz of a random Servant in Fate Grand Order, you'll have 5 minutes to answer!"
    });
    this.quizStatus = {};
  }
  run(message, args, prefix) {
    if (this.quizStatus[message.channel.id]) {
      message.channel.send("Someone is playing already, please wait until it finishes before starting a new one, okay?");
      return;
    }
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
        result = {
          title: "Which servant has this Noble Phantasm?",
          description: `\u200b\n${r.NP.split('\n').slice(0, 2).join('\n').replace(/\([^\)]+\) /g, '')}\n\n You have 5 minutes to answer (case insensitive, exact full name as in Cirnopedia)`
        }
      } else {
        do {
          r = this.main.util.ARand(servantList);
        } while (r.desc == "None");
        console.log(`[${new Date().toISOString().replace('T', ' ').substr(0, 19)}] ` + r.name);
        result = {
          title: "Which servant is this?",
          description: `\u200b\n${r.desc.replace(new RegExp(r.name, 'g'), '[REMOVED]')} You have 5 minutes to answer (case insensitive, exact full name as in Cirnopedia)`
        }
      }
      this.quizStatus[message.channel.id] = true;
      message.channel.send("", { embed: result }).then(() => {
        let collector = new Discord.MessageCollector(message.channel, m => true, {
          time: 300000
        });

        let quiz_init_owner = message.member.id;

        collector.on('collect', (m, collector) => {
          if (this.quizStatus[message.channel.id]) {
            if (m.content.toLowerCase() == r.name.toLowerCase()) {
              let guild = message.guild;
              let right = guild.emojis.find("name", "AbbySmile");
              message.channel.send(`${right} **Congratulations ${m.author}!** ${right}\nThe right answer is **${r.name}**!`);
              this.quizStatus[message.channel.id] = 0;
              collector.stop();
            } else if (m.content.toLowerCase() == "stoppu" && (m.member.hasPermission('MANAGE_GUILD') || m.member.id == quiz_init_owner)) {
              let guild = message.guild;
              let right = guild.emojis.find("name", "AbbyStronk");
              message.channel.send(`Quiz aborted! ${right}`);
              this.quizStatus[message.channel.id] = 0;
              collector.stop();
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
        })

      })
    });
  }
}