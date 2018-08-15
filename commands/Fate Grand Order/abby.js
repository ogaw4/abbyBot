const Command = require('../../main/command');
const Constants = require('../../main/const');

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

    let pic = Math.trunc(Math.random() * 559 + 1);
    let str_pic = this.zeroFill(pic, 3);
    message.channel.send('', {file: {attachment: `${Constants.db}images/CE/${str_pic}.png`, name: 'Abby.png'}});
  }
}