const Command = require('../../main/command');
const Constants = require('../../main/const');
const fetch = require('node-fetch');

module.exports = class FGOServantCommand extends Command {
  constructor(main) {
    super(main, {
      name: "servant",
      category: "Fate Grand Order",
      help: "Get the info for a certain Servant",
      args: [
        {
          name: "Search Term",
          desc: "The search term. Can be Servant's name, or Servant ID. In case of Servant ID, add `id:` in front of the ID you want to get.\n\n**Example:** id:001.5 would get the servant with ID 1.5."
        }
      ],
      alias: ["serv"]
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
            args = result.item;
            let attack = args.attacks.replace(/.{2}/g, function (match) {
              return ["", "Quick, ", "Arts, ", "Buster, "][parseInt(match)];
            }).slice(0, -2);
            args.note = args.note.replace(/ +(\n|$)/g, "\n");
            if (args.note == "\n") args.note = "None";
            let embed = {
              title: `${args.name} (ID: ${args.id})`,
              color: 0xff0000,
              fields: [
                {
                  name: "Rarity",
                  value: args.rarity,
                  inline: true
                },
                {
                  name: "Alignment",
                  value: args.alignment,
                  inline: true
                },
                {
                  name: "Class",
                  value: args.servantClass,
                  inline: true
                },
                {
                  name: "Cost",
                  value: args.cost,
                  inline: true
                },
                {
                  name: "HP",
                  value: args.baseHP + ' (' + args.maxHP + ')',
                  inline: true
                },
                {
                  name: "ATK",
                  value: args.baseATK + ' (' + args.maxATK + ')',
                  inline: true
                },
                {
                  name: "Attacks",
                  value: attack
                },
                {
                  name: "NP",
                  value: args.NP
                },
                {
                  name: "Description",
                  value: args.desc || "None"
                },
                {
                  name: 'Note',
                  value: args.note || "None"
                }
              ],
              description: "\u200b",
              thumbnail: {
                url: args.image
              },
              url: args.link
            };
            if (result.other && result.other.length) {
              embed.fields[embed.fields.length - 1].value += "\n\u200b";
              embed.fields.push({
                name: "Other results (in servant ID)",
                value: `${result.other.join(' | ')}\n\nUse \`id:<servantID>\` for precise search`
              })
            }
            message.channel.send('', {embed});
          } else message.channel.send("Not found");

        });
      });
    } else {
      message.channel.send(`You didn't provide an argument, please provide an argument or consult \`${prefix}help servant\` for more info`);
    }
  }
}