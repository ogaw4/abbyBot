const Command = require('../../main/command');
const Constants = require('../../main/const');
const fetch = require('node-fetch');

module.exports = class GoodGirlCommand extends Command {
  constructor(main) {
    super(main, {
      name: "goodgirl",
      category: "Fate Grand Order",
      help: "Tell AbbyBot she's a good girl!"
    });
  }
  run(message, args, prefix) {
    fetch(`${Constants.db}goodgirl.json`).then(res => {
        res.json().then(r => {
          let len = Object.keys(r).length;
          let picobj = r[this.main.util.rand(1, len)];
          let embed = {
            title: "Source",
            color: 0xe55fbe,
            description: `Thank you!! Ｏ(≧▽≦)Ｏ`,
            url: picobj.src,
            image: {url: "attachment://image.png"}
          }
          message.channel.send('', {embed, files: [{ attachment: `${Constants.db}images/gg/${picobj.fname}`, name: 'image.png'}]});

        });
    });
  }
}