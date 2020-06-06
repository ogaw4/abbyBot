const util = require('util');
const Command = require('../../main/command');
const Constants = require('../../main/const');
module.exports = class TrackReactsCommand extends Command {
  constructor(main) {
    super(main, {
      name: "track-reacts",
      devOnly: true
    });
  }
  run(message, args, prefix) {
    if (message.author.id == this.main.config.ownerID) {
      let client = this.main.client;
      let guild = message.guild;
      let rulesch = guild.channels.get("716867116363677697");
      rulesch.fetchMessages({limit: 5}).then(
          msgs => {
            let roles_msg = null;


            if (msgs.last().author.id == "478607190761144330") {
                roles_msg = msgs.last();
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

                client.on('messageReactionAdd', (reaction, user) => {
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
                        if (emoji_list.includes(emoji.id)) {
                            message.guild.fetchMember(user.id).then(member => {
                                let cur_role = null;
                                console.log("User changing role", member.displayName);

                                for (let [key, value] of member.roles.entries()) {
                                    if (role_ids.includes(key)) {
                                        cur_role = value;
                                        break;
                                    }
                                }

                                if (cur_role == null) {
                                    member.addRole(role_list[emoji_list.indexOf(emoji.id)])
                                    .then(() => user.send(`Hi! I gave you the ${role_names[emoji_list.indexOf(emoji.id)]} role in ${message.guild.name}!`))
                                    .catch(() => console.error("Error giving user role."));
                                } else {
                                    member.removeRole(cur_role)
                                    .then(() => member.addRole(role_list[emoji_list.indexOf(emoji.id)]))
                                    .then(() => user.send(`Hi! I gave you the ${role_names[emoji_list.indexOf(emoji.id)]} role in ${message.guild.name}!`))
                                    .catch(() => console.error("Error giving user role."));
                                }
                            });
                        }
                        reaction.remove(user);
                    }
                });

            } else {
                console.log("had no roles msg");
            }
          }
      ).catch(msgs => console.log("failed to grab messages"));

    }
  }
}