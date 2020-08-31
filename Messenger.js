const fs = require("fs");
const player = require('play-sound')(opts = {});
const readline = require("readline");
const RecordNewAudio = require("./RecordAudio");

const messagesDirectory = "./messages/";

function PlayOldAudio() {
  return new Promise((res, rej) => {
    player.play("./Greeting.mp3", function(err){
      if (err) {
        rej(err);
      } else {
        res();
      }
    })
  })
}

function GetMessageFilename() {
  return new Promise((resolve) =>
    fs.readdir(messagesDirectory, (err, files) => {
      resolve(messagesDirectory + `Message_${files.length}.wav`);
    })
  );
}

function RecordNewMessage(filename) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const { recording, file } = RecordNewAudio(filename);
  console.log("Recording in progress.");

  rl.question("Press any key to stop...", (ans) => {
    rl.close();
    recording.stop();
    file.close();
    console.log("Stopped!");
  });
}

PlayOldAudio().then(GetMessageFilename().then(RecordNewMessage));
