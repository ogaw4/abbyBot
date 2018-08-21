const Command = require('../../main/command');
const Constants = require('../../main/const');
const snek = require('snekfetch');

module.exports = class FGOMasterCommand extends Command {
  constructor(main) {
    super(main, {
      name: "na-master",
      category: "Fate Grand Order",
      help: "Get the current NA Master Missions and recommended spots.",
      alias: ["nmas"]
    });
  }
  run(message, args, prefix) {    
    snek.get(`${Constants.db}missions.json`).then(r => {
      r = JSON.parse(r.text);
      let jp_missions = r["na-missions"];
      let jp_rec = r["na-rec"];
      let fields = []; 
      fields.push({
        name: "This week's missions: ",
        value: jp_missions.join('\n') + "\n\u200b"
      })
      fields.push({
        name: "Recommended Quests: ",
        value: jp_rec.join('\n') + "\n\u200b"
      })
      message.channel.send('', {embed: {
        title: "NA Master Missions",
        fields
      }})
    }
    );
  }
}