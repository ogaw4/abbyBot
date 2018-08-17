const Command = require('../../main/command');
const Constants = require('../../main/const');

module.exports = class FGOHusbandoCommand extends Command {
  constructor(main) {
    super(main, {
      name: "husbando",
      category: "Fate Grand Order",
      help: "Marry a random male Servant in Fate Grand Order!\n\nCurrent Rate: 5% 5* | 15% 4* | 30% 3* | 25% 2* | 25% 1*"
    });
    this.cooldown = {};
    this.cdMessages = ["Not that fast!", "Polygamy is bad civilization!", "Do we have a Mata Hari over here?", "How many husbandos do you need?",
     "Dedicate yourself to your current husbando!", "How long did your marriage last??"];
  }
  resetCooldown(id) {
    this.cooldown[id] = 0;
  }
  run(message, args, prefix) {
    let name = message.author.username;
    if (message.member) name = message.member.displayName;
    let time = this.cooldown[message.author.id] - message.createdTimestamp + 900000;
    if (time > 0  && message.author.id != this.main.config.ownerID) {
        let cdMess = this.main.util.ARand(this.cdMessages);
        message.channel.send(`${cdMess} You can only use this command once every 15 minutes!! Please wait for ${Math.floor(time / 60000)} minutes and ${Math.ceil(time / 1000) % 60} seconds.`, 
          {file: {attachment: `${Constants.db}images/abbystop.png`, name: "stop.png"}});
    } else {
      this.cooldown[message.author.id] = message.createdTimestamp;
      this.main.util.fgoGacha("M").then(body => {
        message.channel.send('', {embed: {
          title: "Congratulations!!",
          color: 0xff0000,
          description: `\u200b\nCongratulations! ${name} got married to ${body.name}! He has a rarity of ${body.rarity}, how lucky!`,
          image: {
            url: `https://fate-go.cirnopedia.org/icons/servant_card/${body.id}1.jpg`
          }
        }});
      });
    }
  }
}