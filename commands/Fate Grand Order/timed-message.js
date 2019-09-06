const Command = require('../../main/command');
const Constants = require('../../main/const');

module.exports = class TimedMessageCommand extends Command {
  constructor(main) {
    super(main, {
      name: "timed-message",
      category: "Bot Info",
      args: [
        {
          name: "Message content",
          desc: "The message to be sent on a timer."
        }, 
        {
          name: "Timer length",
          desc: "How many seconds between each repetition."
        }
      ],
      help: "Send a set message on a timer. Use the command without arguments to cancel any existing messages.",
      caseSensitive: true
    });
  }
  run(message, args, prefix) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      return message.channel.send("Error: You need to have server management rights to edit drop maps!");
    }
    if (args.length >= 2) {
      message.channel.send("Test test 123");
      message.channel.send(args.splice(0, args.length - 1).join(' '));
      message.channel.send(args[args.length - 1]);
    } else {
      message.channel.send(`Removing timed messages.`);
    }
  }
}