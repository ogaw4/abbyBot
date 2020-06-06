const util = require('util');
const Command = require('../../main/command');
const Constants = require('../../main/const');
module.exports = class RoleMessageCommand extends Command {
  constructor(main) {
    super(main, {
      name: "roles-message",
      devOnly: true
    });
  }
  run(message, args, prefix) {
    if (message.author.id == this.main.config.ownerID) {
      let client = this.main.client;
      let guild = message.guild;
      let rulesch = guild.channels.get("716867116363677697");
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
      let embed = {
        title: `<a:AlteraWiggle:459553151268290560> CLASS SELECTION`,
        description: "React with the Class you want, using the list below as reference. You can only have one Class at any given time.\n",
        fields: [
          {
            name: "Class list",
            value: `<a:JalterNazi:718690757472419922> ${avenger}\n<:SmugSip:718694361579388950> ${archer}\n<:GrampsDOKODA:596080749585760268> ${assassin}\n\
<:KiaraSmugnun:453265964239290390> ${alterego}\n<a:SaderZoom:718690759414513765> ${saber}\n<a:JeanneCheer:650699415501144092> ${ruler}\n\
<:RaikouMamacry:453265964684017685> ${berserker}\n<:MedeaPure:718694392315117579> ${caster}\n<a:CuRun:718690761071394866> ${lancer}\n\
<a:AbbyWhale:718694453103034489> ${foreigner}\n<:BBDisgust:645229655107960832> ${mooncancer}\n<:RiderYareYare:718694420056113172> ${rider}\n\
<a:GanbariMashu:718690757883723776> ${shielder}`
          }
        ]
      }

      rulesch.send('', {embed});


    }
  }
}