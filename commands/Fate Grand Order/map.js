const Command = require('../../main/command');
const Constants = require('../../main/const');
const fetch = require('node-fetch');
const {MessageAttachment} = require('discord.js');

module.exports = class FGOMapCommand extends Command {
  constructor(main) {
    super(main, {
      name: "map",
      category: "Fate Grand Order",
      help: "Get a stage's map.",
      args: [
        {
          name: "Map Name",
          desc: "Self-explanatory. Optional, omit to get the list of available maps."
        }
      ]
    });
  }
  run(message, args, prefix) {
    fetch('https://api.github.com/repos/ogaw4/abbyDB/contents/maps').then(res => {
      res.json().then(r => {
        let maps = { all: [] };
        r.forEach(item => {
          let mapName = item.name.slice(0, -4).toLowerCase();
          maps.all.push(mapName.charAt(0).toUpperCase() + mapName.slice(1));
          maps[mapName] = item["download_url"];
        });
        args = args.join(' ');
        if (args && args != "all" && maps[args]) {
          const attachment = new MessageAttachment(maps[args]);
          message.channel.send(`Map for ${args.charAt(0).toUpperCase()}${args.slice(1)}:`, attachment);
        } else message.channel.send(`List of all available maps:\`\`\`\n${maps.all.join(', ')}\`\`\``);

      });
    });
  }
}