const Listen = require("./controls/Keypad");
const { playOnHandsetRepeat } = require("./playback/audio/Play");

const scenarioMap = {
  raised: {
    420: require("./scenarios/420"),
  },
  dropped: {
    712: require("./scenarios/712"),
  },
  both: {},
};

let currentNumber = "";
let dropped = true;
const killers = {
  waiting: null,
  scenario: null,
};

function stopPlaying() {
  const promises = [];
  for (const key in killers) {
    if (killers[key] && typeof killers[key] === "function") {
      try {
        promises.push(killers[key]());
      } catch (e) {
        console.warn(e);
      }
      killers[key] = null;
    }
  }
  return Promise.all(promises).then(() => console.log("All stopped"));
}

function clearNumber() {
  currentNumber = "";
}

function onDigit(digit) {
  console.log("> ", digit);
  currentNumber += digit + "";
  checkNumber(currentNumber);
}

function onRaise() {
  console.log("> Raised");
  dropped = false;
  clearNumber();
  stopPlaying();
  killers.waiting = playOnHandsetRepeat("./audio/take.mp3");
}

function onDrop() {
  console.log("> Dropped");
  dropped = true;
  console.log("# : ", currentNumber);
  clearNumber();
  stopPlaying();
}

function checkNumber(num) {
  let scenario;
  if (!dropped) {
    if (scenarioMap.raised[num]) {
      scenario = scenarioMap.raised[num];
    }
  } else if (dropped) {
    if (scenarioMap.dropped[num]) {
      scenario = scenarioMap.dropped[num];
    }
  } else {
    if (scenarioMap.both[num]) {
      scenario = scenarioMap.both[num];
    }
  }
  if (typeof scenario === "function") {
    stopPlaying().then(() => {
      try {
        killers.scenario = scenario();
      } catch (e) {
        console.warn(e);
      }
    });
  }
}

Listen(
  {
    dropPin: 13,
    rotatingPin: 19,
    countPin: 26,
  },
  {
    onDigit,
    onRaise,
    onDrop,
  }
);
