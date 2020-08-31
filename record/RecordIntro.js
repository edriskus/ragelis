const readline = require("readline");
const RecordNewAudio = require("./RecordAudio");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const { recording, file } = RecordNewAudio("./Greeting.wav");
console.log("Recording in progress.");

rl.question("Press any key to stop...", (ans) => {
  rl.close();
  recording.stop();
  file.close();
  console.log("Stopped!");
});