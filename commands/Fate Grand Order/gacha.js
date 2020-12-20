const Command = require('../../main/command');
const fetch = require('node-fetch');
const Canvas = require('canvas');
const Constants = require('../../main/const');
const {MessageAttachment} = require('discord.js');

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
    this.cooldownYolo = {};
    this.cdMessages = ["Not that fast!", "No whaling allowed!", "Are you sure you have enough money?", "Going for NP5?",
     "Don't kill wallet-kun!", "Noo, I'm not on rate up right now!"];
  }
  resetCooldown(id) {
    this.cooldown[id] = 0;
    this.cooldownYolo[id] = 0;
  }
  getCard(data, rate) {
    let dice = Math.floor(Math.random() * 100);
    let item = "";
    if (dice <= rate["s5"])      item = 'S/'  + this.main.util.ARand(data.servants["5"]); 
    else if (dice <= rate["s4"]) item = 'S/'  + this.main.util.ARand(data.servants["4"]);
    else if (dice <= rate["s3"]) item = 'S/'  + this.main.util.ARand(data.servants["3"]);
    else if (dice <= rate["c5"]) item = 'CE/' + this.main.util.ARand(data.ce["5"]);
    else if (dice <= rate["c4"]) item = 'CE/' + this.main.util.ARand(data.ce["4"]);
    else if (dice <= rate["c3"]) item = 'CE/' + this.main.util.ARand(data.ce["3"]);
    console.log(item);
    return item;
  } 
  roll1 (ctx, data, pos, rate) {
    return new Promise((resolve, reject) => {
      rate = rate || Constants.rate.gacha.Rest;
      let card = new Canvas.Image();
      let item = this.getCard(data, rate);
      fetch(`${Constants.db}images/${item}.png`).then(r => {
        r.buffer().then(buf => {
          card.onerror = reject;
          card.onload = () => {
            ctx.drawImage(card, ...pos);
            if (item.length == 5) item += " ";
            resolve(item);
          }
          card.src = buf;
        });
      });
    });
  }
  roll10 (ctx, data) {
    let results = Array(10).fill('');
    let gsr_idx = Math.floor(Math.random() * 10);
    let gs_idx = Math.floor(Math.random() * 10);
    if(gs_idx == gsr_idx) gs_idx = gsr_idx + 1;
    if(gs_idx > 9) gs_idx = gs_idx - 2;
    results = results.map((item, idx) => {
      var index = [];
      if (idx < 5) index = [idx * 129, 0];
      else index = [(idx - 5) * 129, 222];
      if (idx == gsr_idx) return this.roll1(ctx, data, index, Constants.rate.gacha.GSR);
      if (idx == gs_idx) return this.roll1(ctx, data, index, Constants.rate.gacha.GS);
      return this.roll1(ctx, data, index);
    });
    return Promise.all(results);
  }
  run(message, args, prefix) {

    let canvas = "";
    let ctx = "";
    let yolo_flag = false;
    let chosen_gacha = "everything";
    let roller = message.author;
    fetch(`${Constants.db}gatcha.json`).then(res => {
      res.json().then(r => {
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
            if (message.author.id == 83640682283012096) {
              message.channel.send("Sorry Randicorn, the higher-ups said you're not allowed to yolo roll anymore.", {});
            } else if (message.author.id == 163774851897753600) {
              message.channel.send("Sorry Frostbite_, the higher-ups said you're not allowed to yolo roll anymore.", {});            
            } else {
              let time = this.cooldownYolo[message.author.id] - message.createdTimestamp + 60000;
               if (time > 0 && message.author.id != this.main.config.ownerID) {
                let cdMess = this.main.util.ARand(this.cdMessages);
                if (this.main.util.rand(0, 1)) {
                 const attachment = new MessageAttachment( `${Constants.db}images/abbystop.png`);
                 message.channel.send(`${cdMess} You can only use this command once every minute. Please wait for ${Math.ceil(time / 1000) % 60} seconds to try again.`, attachment);
                } else {
                 const attachment = new MessageAttachment( `${Constants.db}images/abbyno.png`);
                 message.channel.send(`${cdMess} You can only use this command once every minute. Please wait for ${Math.ceil(time / 1000) % 60} seconds to try again.`, attachment);            
                }
              } else {
                this.cooldownYolo[message.author.id] = message.createdTimestamp;
                var canvas = new Canvas.Canvas(129, 222);
                var ctx = canvas.getContext('2d');
                const attachment = new MessageAttachment(canvas.toBuffer());
                this.roll1(ctx, r, [0, 0]).then((result) => {
                  message.channel.send(`The results are in after rolling on the '${chosen_gacha}' banner, ${roller} got (card IDs):\`\`\`\n${result}\`\`\``, attachment);
                });
              }
            }
            if (global.gc) { global.gc(); }
          } else {
            let time = this.cooldown[message.author.id] - message.createdTimestamp + 900000;
            if (time > 0 && message.author.id != this.main.config.ownerID) {
             let cdMess = this.main.util.ARand(this.cdMessages);
              if (this.main.util.rand(0, 1)) {
               const attachment = new MessageAttachment( `${Constants.db}images/abbystop.png`);
               message.channel.send(`${cdMess} You can only use this command once every 15 minutes. Please wait for ${Math.floor(time / 60000)} minutes and ${Math.ceil(time / 1000) % 60} seconds to try again.`, 
                attachment);
              } else {
              const attachment = new MessageAttachment( `${Constants.db}images/abbyno.png`);
               message.channel.send(`${cdMess} You can only use this command once every 15 minutes. Please wait for ${Math.floor(time / 60000)} minutes and ${Math.ceil(time / 1000) % 60} seconds to try again.`, 
                attachment);            
              }
            } else {
              this.cooldown[message.author.id] = message.createdTimestamp;
              var canvas = new Canvas.Canvas(645, 444);
              var ctx = canvas.getContext('2d');
              this.roll10(ctx, r).then((results) => {
                results = results.slice(0, 5).join(' | ') + "\n" + results.slice(5).join(' | ');
                const attachment = new MessageAttachment(canvas.toBuffer());
                message.channel.send(`The results are in after rolling on the '${chosen_gacha}' banner, are you salty or are you happy? Here's what ${roller} got (card IDs):\`\`\`\n${results}\`\`\``, attachment);
              });
              if (global.gc) { global.gc(); }
            }
          }
        }
      })
    });
  }
}