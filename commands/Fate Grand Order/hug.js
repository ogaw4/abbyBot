const Command = require('../../main/command');
const Constants = require('../../main/const');

module.exports = class HugCommand extends Command {
  constructor(main) {
    super(main, {
      name: "hug",
      category: "Fate Grand Order",
      help: "Give AbbyBot a hug!"
    });
  }
  run(message, args, prefix) {
    let embed = {
      title: "Source",
      color: 0xe55fbe,
      description: `Yaaaay!! (\*≧∀≦\*)`,
      url: "https://www.pixiv.net/member_illust.php?mode=medium&illust_id=69950901",
      image: {url: "attachment://image.png"}
    }
    message.channel.send('', {embed, files: [{ attachment: `${Constants.db}images/abbyhug.png`, name: 'hug.png'}]});
  }
}