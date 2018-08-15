const Command = require('../../main/command');

module.exports = class CustomCommand extends Command {
  constructor(main) {
    super(main, {
      name: "prefix",
      category: "Setting",
      args: [
        {
          name: "Prefix",
          desc: "Required. The new prefix to be set to. Use `[disable]` to only use bot mention prefix."
        }
      ],
      help: "Set the bot's command prefix.",
      caseSensitive: true
    })
  }
  run(message, args, prefix) {
    if (message.author.id != this.main.config.ownerID) {
      return message.channel.send("Error: You need to own the bot to change its configuration.");
    }
    args = args.join(' ');
    this.main.db.get(`config_${message.guild.id}`).then(config => {
      if (config) config = JSON.parse(config);
      else config = {};
      args = args || `@{this.main.client.user.username}`;
      if (args == "[disable]") {
        config.prefix = false;
        args = "Prefix has been disabled successfully!";
      } else {
        config.prefix = args;
        args = `Prefix has been changed successfully! New prefix is now \`${args}\``;
      }
      this.main.db.set(`config_${message.guild.id}`, JSON.stringify(config)).then(() => {
        message.channel.send(args);
      });
    });
  }
}