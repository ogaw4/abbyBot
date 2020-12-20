const Discord = require('discord.js');
const Util = require('./util');
const Config = require('./config');
const Database = require('./db');
const Constants = require('./const.js');
const Dashboard = require('../dashboard/server.js');
const http = require('http');
module.exports = class AbbyBot {
  constructor(option) {
    this.client = new Discord.Client();
    this.config = new Config(option);
    this.db = new Database(this.config.dbURL);
    this.util = new Util(this);
    this.util.load().then(data => {
      this.commands = data.commands;
      this.events = data.events;
      let loginTime = Date.now();
      this.client.on('ready', () => {
        this.dashboard = new Dashboard(this);
        console.log(`[${new Date().toISOString().replace('T', ' ').substr(0, 19)}] ` + `Logged in! Time taken: ${Date.now() - loginTime}ms`);
        let rulesch = this.client.channels.get("716867116363677697");
        let guild = rulesch.guild;
        rulesch.fetchMessages({limit: 5}).then(
            msgs => {
              let roles_msg = null;            

              if (msgs.first().author.id == "478607190761144330") {
                roles_msg = msgs.first();
              } else {
                console.log(msgs.first().author);
              }
        
              if (roles_msg != null) {
                  roles_msg.clearReactions()
                  .then(()=> roles_msg.react('718690757472419922'))
                  .then(() => roles_msg.react('718694361579388950'))
                  .then(() => roles_msg.react('596080749585760268'))
                  .then(() => roles_msg.react('453265964239290390'))
                  .then(() => roles_msg.react('718690759414513765'))
                  .then(() => roles_msg.react('650699415501144092'))
                  .then(() => roles_msg.react('453265964684017685'))
                  .then(() => roles_msg.react('718694392315117579'))
                  .then(() => roles_msg.react('718690761071394866'))
                  .then(() => roles_msg.react('718694453103034489'))
                  .then(() => roles_msg.react('645229655107960832'))
                  .then(() => roles_msg.react('718694420056113172'))
                  .then(() => roles_msg.react('718690757883723776'))
                  .catch(() => console.error("One of the emojis failed to clear or react."));

                  this.client.on('messageReactionAdd', (reaction, user) => {
                      let emoji_list = ["718690757472419922", "718694361579388950", "596080749585760268",
                      "453265964239290390", "718690759414513765", "650699415501144092", "453265964684017685",
                      "718694392315117579", "718690761071394866", "718694453103034489", "645229655107960832",
                      "718694420056113172", "718690757883723776"];
                      let avenger = guild.roles.get("453461969782177792");
                      let archer = guild.roles.get("453458978865807361");
                      let assassin = guild.roles.get("453459756296699904");
                      let alterego = guild.roles.get("453462310992740352");
                      let saber = guild.roles.get("453458795134451722");
                      let ruler = guild.roles.get("453462221864042496");
                      let berserker = guild.roles.get("453459633684742164");
                      let caster = guild.roles.get("453459455888064514");
                      let lancer = guild.roles.get("453459088781869060");
                      let foreigner = guild.roles.get("453462576257564683");
                      let mooncancer = guild.roles.get("453462308287414303");
                      let rider = guild.roles.get("453459391128272898");
                      let shielder = guild.roles.get("453461915377598465");
                      let role_ids = ["453461969782177792", "453458978865807361", "453459756296699904", "453462310992740352",
                                      "453458795134451722", "453462221864042496", "453459633684742164", "453459455888064514", "453459088781869060",
                                      "453462576257564683", "453462308287414303", "453459391128272898", "453461915377598465"];
                      let role_list = [avenger, archer, assassin, alterego, saber, ruler, berserker, caster, lancer, foreigner, mooncancer, rider, shielder];
                      let role_names = ["Avenger", "Archer", "Assassin", "Alter Ego", "Saber", "Ruler", "Berserker", "Caster", "Lancer", "Foreigner", "Moon Cancer", "Rider", "Shielder"];
                      let message = reaction.message, emoji = reaction.emoji;
                      if (message.id == roles_msg.id && user.id != "478607190761144330") {
                          let time = Date.now() - global.rolesCD[user.id];
                          if (typeof global.rolesCD[user.id] === "undefined" || time >= 5000) {
                            if (emoji_list.includes(emoji.id)) {
                                message.guild.fetchMember(user.id).then(member => {
                                    let cur_role = null;
                                    console.log("User changing role", member.displayName, "with emoji id", emoji.id);

                                    for (let [key, value] of member.roles.entries()) {
                                        if (role_ids.includes(key)) {
                                            cur_role = value;
                                            console.log("found cur role id", cur_role.id);
                                            break;
                                        }
                                    }

                                    if (cur_role == null) {
                                        member.addRole(role_list[emoji_list.indexOf(emoji.id)])
                                        .then(() => user.send(`Hi! I gave you the ${role_names[emoji_list.indexOf(emoji.id)]} role in ${message.guild.name}!`))
                                        .catch(() => console.error("Error giving user role."));
                                        console.log("added role id", role_list[emoji_list.indexOf(emoji.id)].id);
                                    } else {
                                        member.removeRole(cur_role)
                                        .then(() => member.addRole(role_list[emoji_list.indexOf(emoji.id)]))
                                        .then(() => user.send(`Hi! I gave you the ${role_names[emoji_list.indexOf(emoji.id)]} role in ${message.guild.name}!`))
                                        .catch(() => console.error("Error giving user role."));
                                        console.log("added role id", role_list[emoji_list.indexOf(emoji.id)].id,"after removal");
                                    }
                                    global.rolesCD[user.id] = Date.now();
                                });
                            }
                          } else {
                            user.send(`Don't spam role changes! Wait a few seconds!`)
                                        .catch(() => console.error("Error sending user message."));                          
                          }
                          reaction.remove(user);
                      }
                  });

              } else {
                  console.log("had no roles msg");
              }
            }
        ).catch(msgs => console.log("failed to grab messages"));
      });
      this.client.on('disconnect', () => {
        loginTime = Date.now();
      });
      this.client.on('guildCreate', () => {
        if (this.dashboard) this.dashboard.update({ type: "guildChange", data: this.client.guilds.size });
        this.client.channels.get('265147163321958400').send(`${this.client.user.username} has been added to another guild! Total guild count: ${this.client.guilds.size}`);
      });
      this.client.on('guildDelete', () => {
        if (this.dashboard) this.dashboard.update({ type: "guildChange", data: this.client.guilds.size });
        this.client.channels.get('265147163321958400').send(`${this.client.user.username} has been removed from a guild! Total guild count: ${this.client.guilds.size}`);
      });
      this.client.on('guildMemberAdd', m => {
        if (!this.config.selfbot) {
          this.db.get(`config_${m.guild.id}`).then(config => {
            if (config) {
              config = JSON.parse(config).welcome;
              if (config) {
                config = config.replace(/\[member]/g, m).replace(/\[guild]/g, m.guild).split(':');
                member.guild.channels.get(config[0]).send(config.slice(1).join(':'));
              }
            }
          })
        }
      });
      this.client.on('message', message => {
        if (message.author.bot || !message.guild) return;
        if (this.config.selfbot && message.author.id != this.client.user.id && message.author.id != this.config.ownerID) return;
        this.db.get(`config_${message.guild.id}`).then(config => {
          let prefix = this.config.prefix;
          if (config) {
            config = JSON.parse(config);
            if (config.prefix) prefix = config.prefix;
            else if (config.prefix === false) prefix = false;
          }
          let textPrefix = message.guild.me.displayName;
          if (prefix) textPrefix = new RegExp(`^${prefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/gi, '\\$&')}|<@\!?${this.client.user.id}>|@${textPrefix}`);
          else {
            textPrefix = new RegExp(`<@\!?${this.client.user.id}>|@${textPrefix}`);
            prefix = `@${this.client.user.username}`;
          }
          if (!message.content.match(textPrefix)) return;

          let content = message.content.replace(textPrefix, '').trim();
          let cleanContent = message.cleanContent.replace(textPrefix, '').trim();
          let args = content.split(' ');

          let customCommand;
          if (config && config.commands) customCommand = new Map([...Constants.emoji, ...config.commands]);
          else customCommand = Constants.emoji;
          let command = this.commands.get(args[0].toLowerCase());
          if (command) {
            if (command.cleanContent) {
              args = cleanContent;
              if (!command.caseSensitive) args = args.toLowerCase();
              args = args.split(' ');
            } else if (!command.caseSensitive) {
              args = content.toLowerCase().split(' ');
            }
            command.run(message, args.slice(1), prefix);
            command.timeUsed++;
            this.dashboard.update({ type: "commandUsage" })
            console.log(`[${new Date().toISOString().replace('T', ' ').substr(0, 19)}] ` + `${command.name} command has been triggered`);

          } else if (customCommand.has(args[0])) message.channel.send(customCommand.get(args[0]));
        });
      });
      this.client.on('error', console.error);
      this.client.login(this.config.token).catch(console.log);      
    }).catch(console.log);
  }
}
