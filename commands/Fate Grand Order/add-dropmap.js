const Command = require('../../main/command');
const Constants = require('../../main/const');

module.exports = class AddDropMapCommand extends Command {
  constructor(main) {
    super(main, {
      name: "add-dropmap",
      category: "Fate Grand Order",
      args: [
        {
          name: "Map Name",
          desc: "The name of the map to be added."
        }, 
        {
          name: "Map URL",
          desc: "Direct image link for the drop map."
        }
      ],
      help: "Add a new drop map."
    });
  }
  run(message, args, prefix) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      return message.channel.send("Error: You need to have server management rights to edit drop maps!");
    }

    if (args.length == 2) {
      message.channel.send(Constants.pushMap(args[0], args[1]));
    } else {
      message.channel.send(`You need to inform the map name and the map url.`);
    }
  }
}