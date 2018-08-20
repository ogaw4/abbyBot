const Command = require('../../main/command');
const snek = require('snekfetch');
const Canvas = require('canvas');
const Constants = require('../../main/const');

module.exports = class GachaCommand extends Command {
  constructor(main) {
    super(main, {
      name: "gacha",
      category: "Fate Grand Order",
      help: "Do a simulated FGO Gacha. Example: ?gacha story",
      args: [
        {
          name: "list",
          desc: "List the available gacha banners."
        },
        {          
          name: "banner",
          desc: "Optional. You can choose a banner to roll on, if not provided the banner will have every single servant and CE in the game."
        },
        {
          name: "yolo",
          desc: "Optional. Include this for a solo roll. If not included, a 10-roll with a 15-minute cooldown will be carried out."
        }
      ]
    });
    this.cooldown = {};
    this.cdMessages = ["Not that fast!", "No whaling allowed!", "Are you sure you have enough money?", "Going for NP5?",
     "Don't kill wallet-kun!", "Noo, I'm not on rate up right now!"];
  }
  resetCooldown(id) {
    this.cooldown[id] = 0;
  }
  getCard(data, rate) {
    let dice = Math.random() * 100;
    let item = "";
    if (dice <= rate["s5"])      item = 'S/'  + this.main.util.ARand(data.servants["5"]); 
    else if (dice <= rate["s4"]) item = 'S/'  + this.main.util.ARand(data.servants["4"]);
    else if (dice <= rate["s3"]) item = 'S/'  + this.main.util.ARand(data.servants["3"]);
    else if (dice <= rate["c5"]) item = 'CE/' + this.main.util.ARand(data.ce["5"]);
    else if (dice <= rate["c4"]) item = 'CE/' + this.main.util.ARand(data.ce["4"]);
    else if (dice <= rate["c3"]) item = 'CE/' + this.main.util.ARand(data.ce["3"]);
    return item;
  } 
  roll1 (ctx, data, pos, rate) {
    return new Promise((resolve, reject) => {
      rate = rate || Constants.rate.gacha.Rest;
      let card = new Canvas.Image();
      let item = this.getCard(data, rate);
      snek.get(`${Constants.db}images/${item}.png`).then(r => {
        card.onerror = reject;
        card.onload = () => {
          ctx.drawImage(card, ...pos);
          if (item.length == 5) item += " ";
          resolve(item);
        }
        card.src = r.body;
      });
    });
  }
  roll10 (ctx, data) {
    let results = Array(10).fill('');
    results = results.map((item, index) => {
      if (index < 5) index = [index * 129, 0];
      else index = [(index - 5) * 129, 222];
      if (index == 0) return this.roll1(ctx, data, index, Constants.rate.gacha.GSR);
      if (index == 1) return this.roll1(ctx, data, index, Constants.rate.gacha.GS);
      return this.roll1(ctx, data, index);
    });
    return Promise.all(results);
  }
  run(message, args, prefix) {

    let canvas = "";
    let ctx = "";
    let yolo_flag = false;
    let chosen_gacha = "everything";
    snek.get(`${Constants.db}gatcha.json`).then(r => {
      r = JSON.parse(r.text);
      var keys = [];
      for (var k in r) keys.push(k);
      let gachas = Array.from(keys);
      if (args[0] == "list") {        
        message.channel.send(`List of all available banners:\n${gachas.join(', ')}`);
      } else {
        if (typeof args[0] != "undefined" && gachas.indexOf(args[0].toLowerCase()) > -1) {
          r = r[args[0].toLowerCase()];
          chosen_gacha = args[0].toLowerCase();
          if (args[1] == "yolo") {
            yolo_flag = true;
          }
        } else {
          r = r["everything"];
          if (args[0] == "yolo") {
            yolo_flag = true;
          }
        }

        if (yolo_flag) {
          const canvas = new Canvas(129, 222);
          const ctx = canvas.getContext('2d');
          this.roll1(ctx, r, [0, 0]).then((result) => {
            message.channel.send(`The results are in after rolling on the '${chosen_gacha}' banner, you got (card IDs):\`\`\`\n${result}\`\`\``, {file: {attachment: canvas.toBuffer(), name: "result.png"}});
          });
        } else {
          let time = this.cooldown[message.author.id] - message.createdTimestamp + 900000;
          if (time > 0 && message.author.id != this.main.config.ownerID) {
           let cdMess = this.main.util.ARand(this.cdMessages);
           message.channel.send(`${cdMess} You can only use this command once every 15 minutes. Please wait for ${Math.floor(time / 60000)} minutes and ${Math.ceil(time / 1000) % 60} seconds to try again.`, 
            {file: {attachment: `${Constants.db}images/abbystop.png`, name: "stop.png"}});
          } else {
            console.log("doing 10 roll");
            this.cooldown[message.author.id] = message.createdTimestamp;
            const canvas = new Canvas(645, 444);
            const ctx = canvas.getContext('2d');
            this.roll10(ctx, r).then((results) => {
              results = results.slice(0, 5).join(' | ') + "\n" + results.slice(5).join(' | ');
              message.channel.send(`The results are in after rolling on the '${chosen_gacha}' banner, are you salty or are you happy? Here's what you got (card IDs):\`\`\`\n${results}\`\`\``, {file: {attachment: canvas.toBuffer(), name: "result.png"}});
            });
          }
        }
      }
    });
  }
}