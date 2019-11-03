const Command = require('../../main/command');
const Constants = require('../../main/const');

module.exports = class TimedMessageCommand extends Command {
  constructor(main) {
    super(main, {
      name: "vore",
      category: "Setting",
      args: [
        {
            name: "(Optional) User",
            desc: "Which user's messages to eat."
        },
        {
          name: "Message count",
          desc: "How many messages to eat."
        }
      ],
      help: "Eat messages from people who were being naughty.",
      caseSensitive: true
    });
  }
  run(message, args, prefix) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.channel.send("Error: You need to have message management rights to give me food!");
    }
    if (args.length >= 1) {
        var user = message.mentions.users.first();
        var count = parseInt(args[args.length - 1]);
        message.channel.fetchMessages({ limit: `${count + 1}` }).then((messages) => {
            if (user) {
              const filterBy = user ? user.id : this.client.user.id;
              messages = messages.filter(m => m.author.id === filterBy).array().slice(0, count);
            }
            message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
        });
        message.channel.send("Nom nom nom");
    } else {
        return message.channel.send("I don't know how many messages I can eat...");
    }
  }
}