const Command = require('../../main/command');
const Constants = require('../../main/const');
const snek = require('snekfetch');

module.exports = class AbbyCommand extends Command {
  constructor(main) {
    super(main, {
      name: "abby",
      category: "Fate Grand Order",
      help: "Get a random Abby pic!"
    });
  }
  zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
      return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
  }
  run(message, args, prefix) {

    snek.get(`${Constants.db}abby.json`).then(r => {
        r = JSON.parse(r.text);
        let len = Object.keys(r).length;
        let picobj = r[this.main.util.rand(0, len - 1)];
        message.channel.send(`<${picobj.src}>`, {file: {attachment: `${Constants.db}images/abby/${picobj.fname}`, name: 'Abby.png'}});
    });
    
  }
}