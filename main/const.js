module.exports = {
  db: "https://raw.githubusercontent.com/ogaw4/abbyDB/master/",
  rate: {
    fgo: [1, 3, 20, 50],
    gacha: {
      GSR: {s5: 1, s4: 20, c5: 24, c4: 100},
      GS: {s5: 1, s4: 4, s3: 100},
      Rest: {s5: 1, s4: 4, s3: 20, c5: 24, c4: 36, c3: 100}
    },
    vc: [2, 30, 200, 500]
  },
  emoji: new Map([
    ["lol", "http://i.imgur.com/NnuU2km.gif"],
    ["huhu","http://i.imgur.com/Vpsng9m.png"],
    ["rip","http://i.imgur.com/CXFDRZg.png"],
    ["noob","http://i.imgur.com/v7r7fwG.gif"],
    ["jam","http://i.imgur.com/ZXlW6fi.png"],
    ["yorokobe","http://i.imgur.com/CGj0vTt.png"],
    ["lewd","http://i.imgur.com/XH34as1.jpg"],
    ["lenny","( ͡° ͜ʖ ͡°)"],
    ["tableflip","(╯°□°）╯︵ ┻━┻"],
    ["unflip","┬─┬﻿ ノ( ゜-゜ノ)"],
    ["shrug","¯\\_(ツ)_/¯"],
    ["police","http://i.imgur.com/YCxseg7.png"]
  ]),
  cirno: new Map([
    ["interested", 'http://i.imgur.com/mFGvw33.png'],
    ["serious", 'http://i.imgur.com/FW9LtSk.png']
  ]),
  dropMap : new Map([
    ['fuyuki', 'https://i.imgur.com/TsZ8xYs.png'],
    ['orleans', 'https://i.imgur.com/HQ8x25h.png'],
    ['rome', 'https://i.imgur.com/kkmWHPP.png'],
    ['okeanos', 'https://i.imgur.com/sttaCag.png'],
    ['london', 'https://i.imgur.com/f8dRAp5.png'],
    ['america', 'https://i.imgur.com/fIBQkVJ.jpg'],
    ['camelot', 'https://i.imgur.com/4WxSnQp.jpg'],
    ['babylon', 'https://i.imgur.com/3HHRMF6.jpg'],
    ['shinjuku', 'https://i.imgur.com/V54CH7q.jpg'],
    ['agartha', 'https://i.imgur.com/ocE3A5y.jpg'],
    ['shimosa', 'https://i.imgur.com/aDK6JCa.jpg'],
    ['salem', 'https://i.imgur.com/TTS1Vzz.jpg'], 
    ['anastasia', 'https://i.imgur.com/Cwzv15f.jpg'], 
    ['lb1', 'https://i.imgur.com/Cwzv15f.jpg'], 
    ['goetterdaemmerung', 'https://i.imgur.com/jcs4wZl.jpg'],
    ['lb2', 'https://i.imgur.com/jcs4wZl.jpg']
  ])
}

module.exports.pushMap = function pushMap(mapName, mapUrl) {
  if (module.exports.dropMap.has(mapName)) {
    return "There's already a map with that name in the list.";
  } else {
    module.exports.dropMap.set(mapName, mapUrl);
    return "Map " + mapName + " added to the list.";
  }

}

module.exports.dropMap = function dropMap(mapName) {
  if (module.exports.dropMap.has(mapName)) {
    if (module.exports.dropMap.delete(mapName)) {
      return "Map " + mapName + " successfully removed.";
    } else {
      return "Error removing map " + mapName + ", sorry!";
    }
  } else {
    return "Map not found.";
  }
}