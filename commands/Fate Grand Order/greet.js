const Command = require('../../main/command');
const {MessageAttachment} = require('discord.js');


module.exports = class GreetCommand extends Command {
  constructor(main) {
    super(main, {
      name: "greet",
      category: "Fate Grand Order",
      help: "Whassup homies!"
    });
  }
  run(message, args, prefix) {
    const attachment = new MessageAttachment("http://i.imgur.com/eoWffyo.png");
    message.channel.send(attachment);
  }
}