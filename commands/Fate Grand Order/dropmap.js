const Command = require('../../main/command');
const Constants = require('../../main/const');
const {MessageAttachment} = require('discord.js');

module.exports = class DropMapCommand extends Command {
  constructor(main) {
    super(main, {
      name: "dropmap",
      category: "Fate Grand Order",
      args: [
        {
          name: "Map Name",
          desc: "The name of the map to display (case insensitive)\nOptional, omit to display the list of all available maps."
        }
      ],
      help: "Get a certain drop map.",
      alias: ["dmap"]
    });
  }
  run(message, args, prefix) {
    args = args.join(' ');
    if (args) {
      if (Constants.dropMap.has(args)) {
        const attachment = new MessageAttachment(Constants.dropMap.get(args));
        message.channel.send(`Drop map for ${args.charAt(0).toUpperCase()}${args.slice(1)}:`, attachment);
      } else {
        message.channel.send(`List of all available maps:\n${Array.from(Constants.dropMap.keys()).join(', ')}`);
      }
    } else {
      message.channel.send(`List of all available maps:\n${Array.from(Constants.dropMap.keys()).join(', ')}`);
    }
  }
}