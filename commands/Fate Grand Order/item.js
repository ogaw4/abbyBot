const Command = require('../../main/command');
const Constants = require('../../main/const');
const {MessageAttachment} = require('discord.js');

module.exports = class ItemSearchCommand extends Command {
  constructor(main) {
    super(main, {
      name: "item",
      category: "Fate Grand Order",
      help: "Get most efficient and highest drop rate info for a certain item.",
      args: [
        {
          name: "Search Term",
          desc: "Search term for item, can be either name or item ID. Omit this to get a list of all items."
        }
      ],
      alias: ["i"]
    });
  }
  run(message, args, prefix) {
    if (args = args.join(' ')) {
      this.main.util.fgoItem(args).then(item => {
        if (item) {
          message.channel.send('', {embed: {
            title: `${item.name} - ID: ${item.id}`,
            description: '\u200b',
            fields: [
              {
                name: "Most efficient",
                value: item.AP
              },
              {
                name: "Highest Drop Rate",
                value: item.drop
              }
            ],
            thumbnail: { url: item.img }
          }});
        } else {
          const attachment = new MessageAttachment(`${Constants.db}Ascensionx.gif`);
          message.channel.send('Cannot find mentioned item, please enter the correct item name or item ID\n\nList of available items:', attachment);
        }
      });
    } else {
      const attachment = new MessageAttachment(`${Constants.db}Ascensionx.gif`);
      message.channel.send('List of available items:', attachment);
    }
  }
}
