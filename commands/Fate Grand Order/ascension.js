const Command = require('../../main/command');
const Constants = require('../../main/const');
const fetch = require('node-fetch');

module.exports = class FGOAscensionMatsCommand extends Command {
  constructor(main) {
    super(main, {
      name: "ascension",
      help: "Get the Ascension materials requirements for a certain servant.",
      category: "Fate Grand Order",
      args: [
        {
          name: "Search Term",
          desc: "The search term. Can be Servant's name, or Servant ID. In case of Servant ID, add `id:` in front of the ID you want to get.\n\n**Example:** id:001.5 would get the servant with ID 1.5."
        }
      ],
      alias: ["asc"]
    });
  }
  run(message, args, prefix) {
    if (args = args.join(' ')) {
      fetch(`${Constants.db}fgo_main.json`).then(res => {
        res.json().then(r => {
          let result = args.match(/^id: *(.+)/);
          if (result) result = {item: r[result[1]]};
          else {
            result = false;
            for (let item in r) {
              let aliases = r[item].alias.map(function(itm) { return itm.toLowerCase(); });
  
              if (aliases.indexOf(args.toLowerCase()) > -1) {
                if (result) result.other.push(r[item].id);
                else result = {item: r[item], other: []};
              }
            }
          }
          if (result) {
            r = result.item;
            let embed = {
              title: r.name + ' (ID: ' + r.id + ')',
              color: 0xff0000,
              description: "\u200b",
              thumbnail: {
                url: r.image
              },
              url: r.link
            }
            if (r.item != "None") {
              r.item = r.item.split("\n\n");
              embed.fields = [
                {
                  name: "1st Ascension",
                  value: r.item[0] + "\n\u200b"
                },
                {
                  name: "2nd Ascension",
                  value: r.item[1] + "\n\u200b"
                },
                {
                  name: "3rd Ascension",
                  value: r.item[2] + "\n\u200b"
                },
                {
                  name: "4th Ascension",
                  value: r.item[3]
                }
              ];
            } else embed.fields = [ { name: "None", value: "\u200b" }];
            if (result.other && result.other.length) {
              embed.fields[embed.fields.length - 1].value += "\n\u200b";
              embed.fields.push({
                name: "Other results (in servant ID)",
                value: result.other.join(' | ') + "\n\nUse `id:<servantID>` for precise search"
              })
            }
            message.channel.send('', {embed});
          } else message.channel.send(`Cannot find servant with the provided search term, please check your search term and try again!`);
        });
      });
    } else {
      message.channel.send(`You didn't provide a search term, please provide one or consult \`${prefix}help ascension\` for more information.`);
    }
  }
}