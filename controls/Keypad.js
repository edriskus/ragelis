const Gpio = require("onoff").Gpio;

module.exports = ({ dropPin = 13, rotatingPin = 19, countPin = 26 }, { onDigit, onRaise, onDrop }) => {
  let rotating = 0;
  let numberCount = 0;
  let dropped = 1;

  new Gpio(dropPin, "in", "both").watch((err, value) => {
    if (value !== dropped) {
      if (value === 1) {
        onDrop();
      } else {
        onRaise();
      }
    }
    dropped = value;
  });

  new Gpio(rotatingPin, "in", "both").watch((err, value) => {
    if (!rotating && value === 1) {
      numberCount = 0;
    } else if (rotating && value === 0) {
      if (numberCount > 9) {
        onDigit(0);
      } else if (numberCount > 0) {
        onDigit(numberCount);
      }
      numberCount = 0;
    }
    rotating = value;
  });

  new Gpio(countPin, "in", "falling").watch((err, value) => {
    if (value === 0 && rotating) {
      numberCount++;
    }
  });
};
