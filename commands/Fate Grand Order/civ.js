const Command = require('../../main/command');

module.exports = class CivilizationCommand extends Command {
  constructor(main) {
    super(main, {
      name: "civ",
      category: "Fate Grand Order",
      args: [
        {
          name: "User Mention",
          desc: "Optional, will be the user himself if omitted"
        }
      ],
      help: "Is ?? good civilization?"
    })
  }
  run(message, args, prefix) {
    args = message.mentions.users.first() || message.author;
    message.guild.fetchMember(args).then(i => {
      let guild = message.guild;
      let goodciv = guild.emojis.find("name", "AlteraGoodCiv");
      let badciv = guild.emojis.find("name", "AlteraBadciv");
      if (this.main.util.rand(0, 1)) message.channel.send(`${i.displayName} is good civilization! ${goodciv}`);
      else message.channel.send(`${i.displayName} is bad civilization! ${badciv}`);
    });
  }
}
