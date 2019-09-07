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
    this.message = "";
    this.channel = null;
    this.timeout = null;
  }
  run(message, args, prefix) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      return message.channel.send("Error: You need to have server management rights to edit drop maps!");
    }
    if (args.length >= 2) {
      this.message = args.splice(0, args.length - 1).join(' ');
      this.channel = message.channel;
      if (!(this.timeout)) {
          this.timeout = setInterval(() => {
            this.channel.send(this.message);
          }, parseInt(args[args.length - 1]) * 1000);
      }
    } else {
      message.channel.send(`Removing timed messages.`);
      if (this.timeout) {
        clearInterval(this.timeout);
        this.message = "";
        this.channel = null;
        this.timeout = null;
      }
    }
  }
}