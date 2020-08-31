const player = require("play-sound")((opts = { player: "play" }));

function play(file, AUDIODEV) {
  const bundle = {};
  bundle.result = new Promise((res, rej) => {
    bundle.childProcess = player.play(file, { env: { AUDIODEV } }, function (
      err
    ) {
      if (err) {
        console.warn(err);
      } else {
        res();
      }
    });
  });
  return bundle;
}

const repeat = (file, device) => {
  let bundle = play(file, device);
  let stopped = false;
  let stop = () => new Promise((res, rej) => {
    stopped = true;
    try {
      bundle.childProcess.on("exit", () => { res() })
      bundle.childProcess.kill();
    } catch (e) {
      console.warn(e);
    }
  })
  bundle.result.then(() => !stopped && (stop = repeat(file, device)));
  return () => stop();
};

module.exports = {
  playOnSpeaker: (file) => play(file, "hw:0"),
  playOnHandset: (file) => play(file, "hw:1"),
  playOnSpeakerRepeat: (file) => repeat(file, "hw:0"),
  playOnHandsetRepeat: (file) => repeat(file, "hw:1"),
};
