const Command = require('../../main/command');
const Constants = require('../../main/const');

module.exports = class FGOUSProfileCommand extends Command {
  constructor(main) {
    super(main, {
      name: "na-profile",
      category: "Fate Grand Order",
      help: "Get your saved FGO Profile (NA version)",
      args: [
        {
          name: "Player",
          desc: "Optional. The bot will show the player's profile if this argument is provided and the player's privacy setting is off. Can use User Mention or User ID for this argument."
        }
      ], 
      alias: ["na"]
    });
  }
  run(message, args, prefix) {
    let player = message.author.id;
    if (args = args.join(' ')) {
      let mentionID = args.match(/(?:<@!?)?(\d+)/);
      if (mentionID) player = mentionID[1];
      else player = "";
    }
    Promise.all([this.main.db.get(`fgoUSProfile_${player}`), this.main.client.fetchUser(player)]).then((profile) => {
      if (profile[0]) {
        profile[0] = JSON.parse(profile[0]);
        if (!profile.privacy || !args) message.channel.send('', {embed: this.main.util.fgoProfile(profile[1], profile[0])});
        else message.channel.send(`No peeking! That player has their privacy set to true.`);
      } else if (args) message.channel.send(`Cannot find profile of provided player. Please check the mention and try again!`);
      else message.channel.send(`Profile not found, please use \`${prefix}na-profile-edit\` to create one.`);
    });
  }
}
