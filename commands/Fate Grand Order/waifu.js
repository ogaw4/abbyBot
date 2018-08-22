const Command = require('../../main/command');
const Constants = require('../../main/const');

module.exports = class FGOWaifuCommand extends Command {
  constructor(main) {
    super(main, {
      name: "waifu",
      category: "Fate Grand Order",
      help: "Marry a random female Servant in Fate Grand Order!\n\nCurrent Rate: 5% 5* | 30% 4* | 35% 3* | 15% 2* | 15% 1*"
    });
    this.cooldown = {};
    this.cdMessages = ["Not that fast!", "Polygamy is bad civilization!", "Do we have a Fergus over here?", "How many waifus do you need?",
     "Dedicate yourself to your current waifu!", "How long did your marriage last??"];
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
      this.main.util.fgoGacha("F").then(body => {
        message.channel.send('', {embed: {
          title: "Congratulations!!",
          color: 0xff0000,
          description: `\u200b\nCongratulations! ${name} got married to ${body.name}! She has a rarity of ${body.rarity}, how lucky!`,
          image: {
            url: `https://fate-go.cirnopedia.org/icons/servant_card/${body.id}1.jpg`
          }
        }});
      });
    }
  }
}