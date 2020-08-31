const { playOnSpeakerRepeat } = require("../playback/audio/Play");

module.exports = () => {
  return playOnSpeakerRepeat("./audio/ring.mp3");
};
