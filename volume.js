module.exports = function(RED) {
  "use strict";
  var loudness = require("loudness");

  var INCREMENT_STEP = 5;

  function SetVolume(n) {
    RED.nodes.createNode(this, n);
    this.volume = n.volume;

    var node = this;

    this.on("input", function(msg) {
      loudness.getVolume(function(err, vol) {
        if(err) { node.warn(err); }
        var volume = node.volume;
        if(msg.volume)
          volume = msg.volume;
        if(msg.intensity) {
          volume = msg.intensity;
        }
        if(msg.intent || msg.intent == 0) {
          switch(msg.intent) {
            case 0: volume = 0; break; // close
            case 1: volume = 100; break; // open
            case 2: volume = vol + INCREMENT_STEP; break; // more
            case 3: volume = vol - INCREMENT_STEP; break; // less
            // case : volume = 100 - vol; break; // invert
          }
        }
        if(volume < 0) volume = 0;
        console.log(vol, volume)
        loudness.setVolume(volume, function(err) {
          if(err) {
            node.warn(err);
          }
          node.send(msg);
        });
      });
    });
  }
  RED.nodes.registerType("volume", SetVolume);
}
