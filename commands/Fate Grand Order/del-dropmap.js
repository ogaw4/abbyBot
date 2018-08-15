const Command = require('../../main/command');
const Constants = require('../../main/const');

module.exports = class RemoveDropMapCommand extends Command {
  constructor(main) {
    super(main, {
      name: "del-dropmap",
      category: "Fate Grand Order",
      args: [
        {
          name: "Map Name",
          desc: "The name of the map to be deleted."
        }
      ],
      help: "Remove a drop map."
    });
  }
  run(message, args, prefix) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      return message.channel.send("Error: You need to have server management rights to edit drop maps!");
    }

    if (args.length == 1) {
      message.channel.send(Constants.dropMap(args[0]));
    } else {
      message.channel.send(`You need to inform the map name.`);
    }
  }
}