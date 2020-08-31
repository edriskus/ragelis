const fs = require("fs");
const recorder = require("node-record-lpcm16");

module.exports = function RecordNewAudio(filename) {
  const file = fs.createWriteStream(filename, { encoding: "binary" });
  const recording = recorder.record({
    sampleRate: 44100,
  });
  recording.stream().pipe(file);
  return { recording, file };
};