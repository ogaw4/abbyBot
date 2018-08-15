const Command = require('../../main/command');

module.exports = class GoodGirlCommand extends Command {
  constructor(main) {
    super(main, {
      name: "goodgirl",
      category: "Fate Grand Order",
      help: "Tell AbbyBot she's a good girl!"
    });
  }
  run(message, args, prefix) {
    message.channel.send('Thank you!', {file: {attachment: "https://i.imgur.com/E2qeUEp.png", name: 'Abby.png'}});
  }
}