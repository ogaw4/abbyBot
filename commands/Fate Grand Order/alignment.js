const fetch = require('node-fetch');
const Command = require('../../main/command');
const Constants = require('../../main/const');

module.exports = class AlignmentCommand extends Command {
  constructor(main) {
    super(main, {
      name: "alignment",
      category: "Fate Grand Order",
      args: [
        {
          name: "Search Term",
          desc: "The search term (Chaotic, Neutral, Good, etc.)"
        },
        {
          name: "Page Number",
          desc: "Should be a number. This is optional and will be 1 if omitted."
        }
      ],
      help: "Search for servants with a specific alignment.",
      alias: ["align"]
    })
  }
  run(message, args, prefix) {
    let page;
    let searchTerm;
    if (args.length) {
      if (isNaN(args[args.length - 1])) {
        page = 1;
        searchTerm = args.join(' ');
      } else {
        page = parseInt(args[args.length - 1]);
        searchTerm = args.slice(0, -1).join(' ');
      }
      if (page < 1) page = 1;
      fetch(`${Constants.db}fgo_main.json`).then(res => {
        res.json().then(r => {
          let result = [];
          Object.keys(r).sort().forEach(
            function(id) {
              if (r[id].alignment.toLowerCase().includes(searchTerm)) {
                result.push({
                  name: r[id].name,
                  id: r[id].id
                });
              }
            }
          );
          if (result) {
            let maxPage = Math.ceil(result.length / 10);
            if (page > maxPage) page = maxPage;
            result = result.slice((page - 1) * 10, page * 10).map(item => { return `${item.name} (ID: ${item.id})` });
            message.channel.send('', {
              embed: {
                title: `Servants with ${searchTerm} alignment (Page ${page}/${maxPage}):`,
                description: `\u200b\n${result.join('\n\n')}\n\nPlease use \`${prefix}alignment ${searchTerm} <page number>\` to see other pages`,
                color: 0xff0000
              }
            });
          } else {
            message.channel.send(`Sorry, I couldn't find servants with ${searchTerm} alignment. Please check your search term and try again, Master!`);
          }
        });
      });
    } else {
      message.channel.send(`You didn't provide a search term, please provide a search term or consult \`${prefix}help alignment\` for more info`);
    }
  }
}