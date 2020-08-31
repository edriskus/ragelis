const { playOnHandset } = require("../playback/audio/Play");

module.exports = () => {
  const bundle = playOnHandset("./audio/420.mp3");
  bundle.result.then(() => {
    console.log("Done playing, now what?")
  })
  return () => new Promise((res) => {
    bundle.childProcess.on("exit", () => { res() })
    bundle.childProcess.kill();
  });
};
