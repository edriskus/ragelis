const player = require('play-sound')(opts = { player: "play"});
const Listen = require("./controls/Keypad");

let current;
let raised = false;

function playRing() {
  current = player.play("./audio/ring.mp3", function(err){
    if (!err && !raised) {
      playRing();
    }
  })
}

function onRaise() {
  raised = true;
  if (current) {
    current.kill();
  }
  current = player.play("./audio/take.mp3", { env: { AUDIODEV: "hw:1" }}, function(err){
    if (!err) {
      process.exit();
    }
  })
}

Listen(
  {
    dropPin: 13,
    rotatingPin: 19,
    countPin: 26,
  },
  {
    onRaise,
    onDrop: () => {
      // if (raised && current) {
      //   current.kill();
      //   process.exit();
      // }
    },
    onDigit: () => null
  }
);

playRing();