const Command = require('../../main/command');

module.exports = class AboutCommand extends Command {
  constructor(main) {
    super(main, {
      name: "about",
      category: "Bot Info",
      help: "Know more about the bot"
    });

  }
  run(message, args, prefix) {
    message.channel.send('', {embed: {
      title: `AbbyBot V 1.0.0`,
      description: "AbbyBot is a trimmed down NobuBot Ogawa blatantly stole from Aister, but with some updated stuff. Maybe.",
      fields: [
        {
          name: "Original Creator",
          value: "Aister",
          inline: true
        },
        {
          name: "Code thief",
          value: "Ogawa",
          inline: true
        },
        {
          name: "Engine",
          value: `[Discord.js version ${require('discord.js').version}](https://github.com/hydrabolt/discord.js)`,
          inline: true
        }
      ]
    }});
  }
}