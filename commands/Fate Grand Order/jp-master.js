const Command = require('../../main/command');
const Constants = require('../../main/const');
const fetch = require('node-fetch');

module.exports = class FGOMasterCommand extends Command {
  constructor(main) {
    super(main, {
      name: "jp-master",
      category: "Fate Grand Order",
      help: "Get the current JP Master Missions and recommended spots.",
      alias: ["jmas"]
    });
  }
  run(message, args, prefix) {

    fetch(`${Constants.db}missions.json`).then(res => {
      res.json().then(r => {
        let jp_missions = r["jp-missions"];
        let jp_rec = r["jp-rec"];
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
          title: "JP Master Missions",
          fields
        }})
      });
    }
    );
  }
}